// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./MultiSigVault.sol";
import "hardhat/console.sol";

error NotOwner(address sender, address owner);

struct pool {
    address[] chosenTokens;
    uint256[] proportions; // proportion of tokens in real value
    uint256[] proportionsInPercentage; // proportion of tokens in real percentage
    uint256 totalValue; // summary of total funds in vault in USD
    uint256 tolerance; // how much tokens can be out of balance to triger rebalancing
}

/**
 * @title The RebalancingPools contract
 * @notice A contract that returns latest prices of tokens in rebalancing pools from Chainlink Price Feeds and stores pools proportions
 */
contract RebalancingPools {
    uint256 constant PERC = 1000;
    MultiSigVault vault;
    address immutable owner;
    mapping(address => pool) s_userToPool;
    mapping(address => AggregatorV3Interface) tokensToPriceFeeds;
    address[] availableTokens = [
        0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
        0x6B175474E89094C44Da98b954EedeAC495271d0F
    ]; // Temporarly hardcoded: WBTC, WETH, DAI - Ethereum mainnet

    /* Storage will be removed */
    /* Price Feed Contract Addresses: https://docs.chain.link/docs/data-feeds/price-feeds/addresses/ */
    AggregatorV3Interface[] priceFeeds = [
        AggregatorV3Interface(0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c),
        AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419),
        AggregatorV3Interface(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9)
    ]; // Temporarly hardcoded: BTC/USD, ETH/USD, DAI/USD - Ethereum mainnet

    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert NotOwner(msg.sender, owner);
        }
        _;
    }

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     *
     */
    constructor() {
        owner = msg.sender;
        vault = MultiSigVault(msg.sender);
    }

    /* Setters */
    /**
     * @notice Creates pool for a user with specified parameters. Only Vault will be able to call this.
     * @param _user - user who wants to create the pool
     * @param _chosenTokens - tokens chosen to the pool
     * @param _proportions - proportions of tokens in real number
     * @param _proportionsInPercentage - proportions of tokens in percentage related to total value
     * @param _totalValue - total value of the pool in USD
     * @param _tolerance - possible violation tolerance to accept
     */
    function createPool(
        address _user,
        address[] memory _chosenTokens,
        uint256[] memory _proportions,
        uint256[] memory _proportionsInPercentage,
        uint256 _totalValue,
        uint256 _tolerance
    ) external {
        /* Here will be some fee to earn by app */
        s_userToPool[_user].chosenTokens = _chosenTokens;
        s_userToPool[_user].proportions = _proportions;
        s_userToPool[_user].proportionsInPercentage = _proportionsInPercentage;
        s_userToPool[_user].totalValue = _totalValue;
        s_userToPool[_user].tolerance = _tolerance;
    }

    function removePool(address _user) external returns (uint256) {
        uint256 _totalValue = s_userToPool[_user].totalValue;
        delete s_userToPool[_user];
        return _totalValue;
    }

    /* will be removed temporary function for testing */
    function createInitialMapping() external /* onlyOwner */ {
        uint idx;
        for (idx = 0; idx < availableTokens.length; idx++) {
            tokensToPriceFeeds[availableTokens[idx]] = priceFeeds[idx];
        }
    }

    /**
     * @notice Allows owner to add new token possible to choose
     */
    function addNewToken(
        address _tokenAddress,
        address _priceFeedAddress
    ) external onlyOwner {
        availableTokens.push(_tokenAddress);
        priceFeeds.push(
            AggregatorV3Interface(_priceFeedAddress)
        ); /* will be removed */
        tokensToPriceFeeds[_tokenAddress] = AggregatorV3Interface(
            _priceFeedAddress
        );
    }

    /* @notice This function suppose to be called by the keeper in order to perform rebalancing.
     * Swap tokens with too high USD value into tokens with too low USD value
     * Will interact with vault to rebalance */
    function rebalance(address _user) external {
        (
            ,
            bytes[] memory tooLowBalance,
            bytes[] memory tooHighBalance
        ) = checkPercentageProportions(_user);
        uint256 lowIdx = 0;
        uint256 highIdx = 0;
        uint256 lowDelta = 0;
        address lowTokenAddress;
        uint256 highDelta = 0;
        address highTokenAddress;
        for (
            ;
            lowIdx < tooLowBalance.length && highIdx < tooHighBalance.length;
            lowIdx++
        ) {
            console.log("[Inside]Too low balance:");
            (lowDelta, lowTokenAddress) = abi.decode(
                tooLowBalance[lowIdx],
                (uint256, address)
            );
            (highDelta, highTokenAddress) = abi.decode(
                tooHighBalance[lowIdx],
                (uint256, address)
            );
            if (lowDelta > highDelta) {
                /* higher balance of one token is not enough */
                vault.swap(
                    highTokenAddress,
                    lowTokenAddress,
                    highDelta,
                    highDelta - (highDelta / 100)
                );
                highIdx++;
            } else {
                /* higher balance of one token is enough */
                vault.swap(
                    highTokenAddress,
                    lowTokenAddress,
                    highDelta,
                    (highDelta - (highDelta / 100))
                );
            }
        }
    }

    /* Getters */
    /*
     *  @notice - calculates total balance in USD of the pool
     */
    function getTotalBalanceOfPool(
        address _user
    ) public view returns (uint256) {
        uint256 idx = 0;
        uint256 totalBalance = 0;
        pool memory l_pool = s_userToPool[_user];
        for (; idx < l_pool.chosenTokens.length; idx++) {
            totalBalance += (l_pool.proportions[idx] *
                uint256(getLatestPrice(l_pool.chosenTokens[idx])));
        }
        return totalBalance;
    }

    /*
     *  @notice - calculates balances in USD for each token in the pool
     */
    function getCurrentTokenBalances(
        address _user
    ) public view returns (uint256[] memory) {
        uint256 idx = 0;
        pool memory l_pool = s_userToPool[_user];
        uint256[] memory totalBalances = new uint256[](
            l_pool.chosenTokens.length
        );
        for (; idx < l_pool.chosenTokens.length; idx++) {
            totalBalances[idx] = (l_pool.proportions[idx] *
                uint256(getLatestPrice(l_pool.chosenTokens[idx])));
        }
        return totalBalances;
    }

    /*
     *  @notice - calculates the current percentage proportions related to total value and returns if the pool is out of balance and
     *  which tokens are lacking and exceeding the proportions
     */
    function checkPercentageProportions(
        address _user
    ) public view returns (bool, bytes[] memory, bytes[] memory) {
        bool outOfBalance = false;
        pool memory l_pool = s_userToPool[_user];
        bytes[] memory tooLowBalance = new bytes[](l_pool.chosenTokens.length); // Token addresses where the number of tokens are too low
        bytes[] memory tooHighBalance = new bytes[](l_pool.chosenTokens.length); // Token addresses where the number of tokens are too high
        uint256 delta = 0;
        uint256 idx = 0;
        uint256[] memory totalBalances = getCurrentTokenBalances(_user);
        uint256 totalBalance = getTotalBalanceOfPool(_user);

        for (; idx < l_pool.chosenTokens.length; idx++) {
            console.log("[Inside]Total token balance: %s", totalBalances[idx]);
            console.log("[Inside]Total balance: %s", totalBalance);
            console.log(
                "[Inside]Percentage: %s",
                l_pool.proportionsInPercentage[idx]
            );
            console.log("[Inside]Tolerance: %s", l_pool.tolerance);
            console.log(
                "[Inside]%s vs %s",
                ((totalBalances[idx] * PERC) / totalBalance),
                (l_pool.proportionsInPercentage[idx] - l_pool.tolerance)
            );
            if (
                ((totalBalances[idx] * PERC) / totalBalance) <
                (l_pool.proportionsInPercentage[idx] - l_pool.tolerance)
            ) {
                // proportions for token in dollar are lower than configured
                delta = (l_pool.proportionsInPercentage[idx] -
                    ((totalBalances[idx] * PERC) / totalBalance));
                tooLowBalance[idx] = abi.encode(
                    delta,
                    l_pool.chosenTokens[idx]
                );
                outOfBalance = true;
            } else if (
                ((totalBalances[idx] * PERC) / totalBalance) >
                (l_pool.proportionsInPercentage[idx] + l_pool.tolerance)
            ) {
                // proportions for token in dollar are higher than configured
                delta = (((totalBalances[idx] * PERC) / totalBalance) -
                    l_pool.proportionsInPercentage[idx]);
                tooHighBalance[idx] = abi.encode(
                    delta,
                    l_pool.chosenTokens[idx]
                );
                outOfBalance = true;
            }
        }
        return (outOfBalance, tooLowBalance, tooHighBalance);
    }

    /**
     * @notice Returns the latest price
     */
    function getLatestPrice(
        address _tokenAddress
    ) public view returns (int256) {
        int256 price;
        if (address(tokensToPriceFeeds[_tokenAddress]) == address(0)) {
            // token not available revert
        } else {
            (
                ,
                /*uint80 roundID*/ price,
                /*uint256 startedAt*/
                /*uint256 timeStamp*/
                /*uint80 answeredInRound*/
                ,
                ,

            ) = tokensToPriceFeeds[_tokenAddress].latestRoundData();
        }
        return price;
    }

    /**
     * @notice Returns the Price Feed address
     */
    function getPriceFeed(
        address _tokenAddress
    ) public view returns (AggregatorV3Interface) {
        return tokensToPriceFeeds[_tokenAddress];
    }
}
