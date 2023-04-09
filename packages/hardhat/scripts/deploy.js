// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

async function deploymentFixture() {
  const accounts = await ethers.getSigners();
  const MultiSigVault = await ethers.getContractFactory("MultiSigVault");
  const VaultAutomation = await ethers.getContractFactory("VaultAutomation");

  console.log(`Deploying vault contract by ${accounts[0].address}...`);
  const vault = await MultiSigVault.deploy([accounts[0].address], 1);
  console.log("Deploying automation contract ...");
  const automation = await VaultAutomation.deploy(vault.address, await vault.getRebalancingPoolsAddress());
  const rebalancing = await ethers.getContractAt("RebalancingPools", await vault.getRebalancingPoolsAddress());
  console.log(`MultiSigVault: ${vault.address}`);
  console.log(`RebalancingPools: ${rebalancing.address}`);
  console.log(`VaultAutomation: ${automation.address}`);
  return { vault, rebalancing, automation }
}

async function main() {
  await deploymentFixture();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { deploymentFixture }
