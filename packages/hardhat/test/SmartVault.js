const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { deploymentFixture } = require("../scripts/deploy")



!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Rebalancing Tests", async function () {
        const accounts = await ethers.getSigners();
        const WETH = networkConfig[network.config.chainId]["weth"]
        const WMATIC = networkConfig[network.config.chainId]["wmatic"]
        const ROUTER = networkConfig[network.config.chainId]["sushiswap_router_v2"]

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
                const { vault, rebalancing, automation } = await deploymentFixture();
                console.log("Creating pool ... ");
                await rebalancing.createPool(accounts[0].address,
                    [WETH, WMATIC] /* chosen addresses */,
                    [ethers.BigNumber.from(4e17.toString()), ethers.BigNumber.from(8e20.toString())] /* proportions */,
                    [500, 500] /* proportions in percentage - 50% */,
                    ethers.BigNumber.from(8e20.toString()) /* total value of vault */,
                    10 /* tolerance - 1% */);
                let priceFeed = await rebalancing.getPriceFeed(WETH);
                console.log("Price feed: " + priceFeed)
                let latestPrice = await rebalancing.getLatestPrice(WETH);
                console.log("Price: " + latestPrice / (10 ** 8));
                latestPrice = await rebalancing.getLatestPrice(WMATIC);
                console.log("Price: " + latestPrice / (10 ** 8));
                let [ethBalance, daiBalance] = await rebalancing.getCurrentTokenBalances(accounts[0].address);
                let totalBalance = await rebalancing.getTotalBalanceOfPool(accounts[0].address);
                console.log(`Eth balance: ${ethBalance / (10 ** 26)}`)
                console.log(`Dai balance: ${daiBalance / (10 ** 26)}`)
                console.log(`Total balance: ${totalBalance / (10 ** 26)}`)
                console.log(await rebalancing.checkPercentageProportions(accounts[0].address));
            })
        })

        describe("Check proportions", async function () {

            it("Should be able detect current proportions", async function () {
                console.log("Loading fixture ... ");

                const { vault, rebalancing, automation } = await deploymentFixture();
                console.log("Creating pool ... ");
                await rebalancing.createPool(accounts[0].address,
                    [WETH, WMATIC] /* chosen addresses */,
                    [ethers.BigNumber.from(4e17.toString()), ethers.BigNumber.from(8e20.toString())] /* proportions */,
                    [500, 500] /* proportions in percentage - 50% */,
                    ethers.BigNumber.from(8e20.toString()) /* total value of vault */,
                    10 /* tolerance - 1% */);
                let priceFeed = await rebalancing.getPriceFeed(WETH);
                console.log("Price feed: " + priceFeed)
                let latestPrice = await rebalancing.getLatestPrice(WETH);
                console.log("Price: " + latestPrice / (10 ** 8));
                latestPrice = await rebalancing.getLatestPrice(WMATIC);
                console.log("Price: " + latestPrice / (10 ** 8));
                let [ethBalance, daiBalance] = await rebalancing.getCurrentTokenBalances(accounts[0].address);
                let totalBalance = await rebalancing.getTotalBalanceOfPool(accounts[0].address);
                console.log(`Eth balance: ${ethBalance / (10 ** 26)}`)
                console.log(`Dai balance: ${daiBalance / (10 ** 26)}`)
                console.log(`Total balance: ${totalBalance / (10 ** 26)}`)
                console.log(await rebalancing.checkPercentageProportions(accounts[0].address));
            })
        })


        describe("Deposit and swap", async function () {

            it("Should be able to deposit and swap", async function () {
                const maticToWrap = 2e17.toString();
                console.log("Loading fixture ... ");

                const iWmatic = await ethers.getContractAt("IWETH", WMATIC);
                const iWeth = await ethers.getContractAt("IERC20", WETH);
                const { vault, rebalancing, automation } = await deploymentFixture();

                console.log("Wrapping native token ... ");
                tx = await iWmatic.deposit({ value: maticToWrap })
                await tx.wait()
                const maticToDeposit = await iWmatic.balanceOf(accounts[0].address)
                console.log("Wrapped %s native token", maticToDeposit / 1e18)

                console.log("Aproving ... ");
                tx = await iWmatic.approve(vault.address, maticToDeposit)
                await tx.wait()

                console.log("Depositing ... ");
                await vault.deposit(maticToDeposit, WMATIC);
                console.log("Vault has %s (%s))",
                    (await iWmatic.balanceOf(vault.address) / 1e18),
                    await iWmatic.symbol())

                console.log("Swapping ... ");
                let amount = await vault.swap(WMATIC, WETH, maticToDeposit, 0 /* Temporary */);
                console.log("Swapped %s (%s) to %s (%s)",
                    maticToDeposit,
                    await iWmatic.symbol(),
                    await iWeth.balanceOf(vault.address),
                    await iWeth.symbol())

            })
        })
    })