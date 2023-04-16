//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interface/IUniswap.sol";
import "./interface/IERC20.sol";
import "./RebalancingPools.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSigVault is Ownable {
    /// @notice ------------------events------------------
    event depositDone(address indexed sender, uint256 amount);
    event withdrawalID(uint256 indexed txID);

    /// @notice --------------state variables-------------
    address private Uniswap_V2_Router02 =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private DAI = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private ACCEPTABLE_TOKEN =
        0x6B175474E89094C44Da98b954EedeAC495271d0F; //DAI by default

    RebalancingPools rebalancingPools;
    uint256 approvalLimit;
    address[] public addressesToSign;
    address[] private vaultUsers;
    mapping(address => uint256) usersToFunds;

    uint256 constant MINIMUM_AMOUNT = 10 ** 17; // 0.1

    /// @notice ---------transaction details------------
    struct Transaction {
        address payable _to;
        uint256 amount;
        uint256 txID;
        address[] signers;
    }

    /// @notice -------mapping---------------
    mapping(address => bool) public isSigner;

    /// @notice -----------array of approved signers-------------
    address[] private signatures;
    Transaction[] public Transactions;

    /// @dev ------setting the list of signatory and approvalLimit of the vault-------------
    constructor(address[] memory _addressesToSign, uint256 _approvalLimit) {
        require(_addressesToSign.length > 0, "Invalid Number of signer");

        for (uint256 i; i < _addressesToSign.length; i++) {
            address toSign = _addressesToSign[i];

            require(toSign != address(0), "invalid address");
            require(!isSigner[toSign], "Address is a Signatory To Wallet");

            isSigner[toSign] = true;

            addressesToSign.push(toSign);
        }

        approvalLimit = _approvalLimit;
        rebalancingPools = new RebalancingPools();
        rebalancingPools.createInitialMapping();
    }

    function setDai(address _dai) external onlyOwner {
        DAI = _dai;
    }

    function setAcceptableToken(address _acceptableToken) external onlyOwner {
        ACCEPTABLE_TOKEN = _acceptableToken;
    }

    function setRouter(address _router) external onlyOwner {
        Uniswap_V2_Router02 = _router;
    }

    ///  @notice accepts any amount token into the vault
    function deposit(uint256 _amount, address _tokenAddress) external {
        require(MINIMUM_AMOUNT <= _amount);
        require(ACCEPTABLE_TOKEN == _tokenAddress, "Wrong address");
        if (usersToFunds[msg.sender] == 0) {
            vaultUsers.push(msg.sender);
        }

        usersToFunds[msg.sender] += _amount;

        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);

        emit depositDone(msg.sender, _amount);
    }

    /// @notice -----------return the balance of the contract----------------
    function getBalance(
        address _tokenAddress
    ) public view returns (uint256 balance) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    /// @notice -------------allows withdraw when approvalLimit is met----------
    function withdraw(address _tokenAddress) public returns (uint256) {
        uint256 tmp = usersToFunds[msg.sender];
        usersToFunds[msg.sender] = 0;
        IERC20(_tokenAddress).transfer(msg.sender, tmp);
        return tmp;
    }

    /// @notice Swapping an Exact Token for an Enough Token on the vault
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) public returns (uint256 amountOut) {
        //IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(Uniswap_V2_Router02, amountIn);

        address[] memory path;
        path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        uint256[] memory amounts = IUniswapV2Router(Uniswap_V2_Router02)
            .swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                address(this),
                block.timestamp
            );

        // /// Refund tokenIn when the expected minimum out is not met
        // if (amountOutMin > amounts[2]) {
        //     IERC20(tokenIn).transfer(msg.sender, amounts[0]);
        // }

        return amounts[1];
    }

    /**
     * @notice configure user's pool to specific params.
     * Use IERC20 balanceOf to get total values and achieve proportions
     * Use swapToProportions to get all
     * Call createPool from Rebalancing Pools contract
     */
    function configureRebalancingPool(
        address[] memory _chosenTokens,
        uint256[] memory _proportionsInPercentage,
        uint256 _totalValue,
        uint256 _tolerance
    ) external {
        uint256[] memory proportions = new uint256[](_chosenTokens.length);
        for (uint idx = 0; idx < _chosenTokens.length; idx++) {
            if (_chosenTokens[idx] != ACCEPTABLE_TOKEN) {
                proportions[idx] =
                    (_proportionsInPercentage[idx] * _totalValue) /
                    1000;
                proportions[idx] = swap(
                    ACCEPTABLE_TOKEN,
                    _chosenTokens[idx],
                    proportions[idx],
                    0 /* temporary */
                );
            } else {
                /* Accepted token - already swapped */
                proportions[idx] =
                    (_proportionsInPercentage[idx] * _totalValue) /
                    1000;
            }
        }
        /* Call createPool from Rebalancing Pools contract */
        rebalancingPools.createPool(
            msg.sender,
            _chosenTokens,
            proportions,
            _proportionsInPercentage,
            _totalValue,
            _tolerance
        );
    }

    function getVaultUsers() external view returns (address[] memory) {
        return vaultUsers;
    }

    function getRebalancingPoolsAddress() external view returns (address) {
        return address(rebalancingPools);
    }
}
