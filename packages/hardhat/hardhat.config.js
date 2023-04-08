require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const MAINNET_RPC_URL = process.env.ALCHEMY_MAINNET_RPC_URL
const MUMBAI_RPC_URL =
  process.env.MUMBAI_RPC_URL ||
  "https://not-loaded!"
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL || "https://eth-goerli.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEYS = [process.env.PRIVATE_KEY1,
process.env.PRIVATE_KEY2,
process.env.PRIVATE_KEY3,
process.env.PRIVATE_KEY4,
process.env.PRIVATE_KEY5,
process.env.PRIVATE_KEY6]

// optional
const MNEMONIC = process.env.MNEMONIC || "Your mnemonic"
const FORKING_BLOCK_NUMBER = process.env.FORKING_BLOCK_NUMBER

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
      },
      {
        version: "0.8.7",
      },
      {
        version: "0.7.0",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    localhost: {
      chainId: 31337,
    },
    polygonMumbai: {
      //url: MUMBAI_RPC_URL,
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS : [],
      chainId: 80001,
      //blockConfirmations: 6,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      chainId: 5,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS : [],
      chainId: 137,
    }
  },
  defaultNetwork: "hardhat",
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
    runOnCompile: false,
    // only: [
    //     "APIConsumer",
    //     "AutomationCounter",
    //     "NFTFloorPriceConsumerV3",
    //     "PriceConsumerV3",
    //     "RandomNumberConsumerV2",
    // ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
}