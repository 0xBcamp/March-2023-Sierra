// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

async function deploymentFixture() {
  const accounts = await ethers.getSigners();
  const MultiSigVault = await ethers.getContractFactory("MultiSigVault");
  const VaultAutomation = await ethers.getContractFactory("VaultAutomation");

  console.log(`Deploying vault contract by ${accounts[0].address}...`);
  const vault = await MultiSigVault.deploy([accounts[0].address], 1);
  console.log("Deploying automation contract ...");
  const rebalancing = await ethers.getContractAt("RebalancingPools", await vault.getRebalancingPoolsAddress());
  const automation = await VaultAutomation.deploy(vault.address, rebalancing.address);

  console.log(`MultiSigVault: ${vault.address}`);
  console.log(`RebalancingPools: ${rebalancing.address}`);
  console.log(`VaultAutomation: ${automation.address}`);

  if (!developmentChains.includes(network.name)) {
    console.log("Initialization...");
    await vaultInit(vault, rebalancing);
  }

  return { vault, rebalancing, automation }
}

async function vaultInit(vault, rebalancing) {
  await vault.setWeth(networkConfig[network.config.chainId]["weth"]);
  await vault.setAcceptableToken(networkConfig[network.config.chainId]["wmatic"]);
  await vault.setRouter(networkConfig[network.config.chainId]["sushiswap_router_v2"]);

  await rebalancing.setAvailableTokens([
    networkConfig[network.config.chainId]["weth"],
    networkConfig[network.config.chainId]["dai"]]);

  await rebalancing.setPriceFeeds([
    networkConfig[network.config.chainId]["ethUsdPriceFeed"],
    networkConfig[network.config.chainId]["daiUsdPriceFeed"]]);

  await rebalancing.createInitialMapping();
}

async function main() {
  const contracts = await deploymentFixture();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { deploymentFixture }
