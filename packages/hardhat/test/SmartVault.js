const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { deploymentFixture } = require("../scripts/deploy")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Rebalancing Tests", async function () {
        const accounts = await ethers.getSigners();

        async function deployPriceConsumerFixture() {
            const [deployer] = accounts

            const DECIMALS = "18"
            const INITIAL_PRICE = "200000000000000000000"

            const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator")
            const mockV3Aggregator = await mockV3AggregatorFactory
                .connect(deployer)
                .deploy(DECIMALS, INITIAL_PRICE)

            // const priceConsumerV3Factory = await ethers.getContractFactory("PriceConsumerV3")
            // const priceConsumerV3 = await priceConsumerV3Factory
            //     .connect(deployer)
            //     .deploy(mockV3Aggregator.address)

            return { /* priceConsumerV3 */ mockV3Aggregator }
        }

        describe("Check proportions", async function () {

            it("Should be able detect current proportions", async function () {
                console.log("Loading fixture ... ");
                const {  /* priceConsumerV3 */ mockV3Aggregator } = await loadFixture(
                    deployPriceConsumerFixture
                )
                const { vault, rebalancing, automation } = await deploymentFixture();
                console.log("Creating pool ... ");
                await rebalancing.createPool(accounts[0].address,
                    ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x6B175474E89094C44Da98b954EedeAC495271d0F"] /* chosen addresses */,
                    [ethers.BigNumber.from(4e17.toString()), ethers.BigNumber.from(7e20.toString())] /* proportions */,
                    [500, 500] /* proportions in percentage - 50% */,
                    ethers.BigNumber.from(8e20.toString()) /* total value of vault */,
                    100 /* tolerance - 1% */);
                let priceFeed = await rebalancing.getPriceFeed("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
                console.log("Price feed: " + priceFeed)
                let latestPrice = await rebalancing.getLatestPrice("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
                console.log("Price: " + latestPrice / (10 ** 8));
                latestPrice = await rebalancing.getLatestPrice("0x6B175474E89094C44Da98b954EedeAC495271d0F");
                console.log("Price: " + latestPrice / (10 ** 8));
                let [ethBalance, daiBalance] = await rebalancing.getCurrentTokenBalances(accounts[0].address);
                let totalBalance = await rebalancing.getTotalBalanceOfPool(accounts[0].address);
                console.log(`Eth balance: ${ethBalance / (10 ** 26)}`)
                console.log(`Dai balance: ${daiBalance / (10 ** 26)}`)
                console.log(`Total balance: ${totalBalance / (10 ** 26)}`)
                console.log(await rebalancing.checkPercentageProportions(accounts[0].address));
            })
        })
    })