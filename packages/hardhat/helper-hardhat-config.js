const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "hardhat",
        usdc: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        weth: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        sushiswap_router_v2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiswap_factory_v2: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        master_chef_v2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
        automationUpdateInterval: "30",
        fee: "100000000000000",
        fundAmount: "100000000000000",
        oracle: "0x0a31078cd57d23bf9e8e8f1ba78356ca2090569e", //?
        jobId: "12b86114fa9e46bab3ca436f88e1a912", //?
        subscriptionId: "2385",
        vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
    },
    1: {
        name: "mainnet",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "1000000000000000000",
        automationUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        sushi: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
        uniswap_router_v2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        sushiswap_router_v2: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
        sushiswap_factory_v2: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
        master_chef_v2: "0xef0881ec094552b2e128cf945ef17a6752b4ec5d"
    },
    5: {
        name: "goerli",
        linkToken: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        oracle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
        fee: "100000000000000000",
        fundAmount: "100000000000000000", // 0.1
        automationUpdateInterval: "30",
    },
    137: {
        name: "polygon",
        oracle: "0x0a31078cd57d23bf9e8e8f1ba78356ca2090569e",
        jobId: "12b86114fa9e46bab3ca436f88e1a912",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        fee: "100000000000000",
        fundAmount: "100000000000000",
        automationUpdateInterval: "30",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        weth: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        link: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
        sushi: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
        sushiswap_router_v2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiswap_factory_v2: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        master_chef_v2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F"
    },
    80001: {
        name: "polygonMumbai",
        usdc: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        weth: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        sushiswap_router_v2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiswap_factory_v2: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        master_chef_v2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
        automationUpdateInterval: "30",
        fee: "100000000000000",
        fundAmount: "100000000000000",
        oracle: "0x0a31078cd57d23bf9e8e8f1ba78356ca2090569e", //?
        jobId: "12b86114fa9e46bab3ca436f88e1a912", //?
        subscriptionId: "2385",
        vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
    }
}

const developmentChains = ["hardhat", "localhost"]
const testnetChains = ["mumbai", "goerli"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

const frontEndContractsFile = "./constants/networkMapping.json"
const frontEndAbiLocation = "./constants/"


module.exports = {
    networkConfig,
    developmentChains,
    testnetChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiLocation
}
