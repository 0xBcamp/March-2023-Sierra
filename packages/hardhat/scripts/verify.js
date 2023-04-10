const { developmentChains } = require("../helper-hardhat-config")

/* SCRIPT WORNIKG ONLY ON MUMBAI */
const MULTI_SIG_VAULT = "0x9504b520087fbB5909fde06F4d76d50b0a8430e8"
const REBALANCING_POOLS = "0x9fdA7ACfbA9D83389C84aA3D2A1e79f3Fc3efEfE"
const VAULT_AUTOMATION = "0x00250E3A520E7EE99b603365bf217d4561B2e303"

async function verify(contract, args) {
    console.log(`Verifying contract..`)
    try {
        await run("verify:verify", {
            address: contract.address,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

async function getContracts() {
    const [deployer] = await ethers.getSigners()
    const multiSigVault = await ethers.getContractAt("MultiSigVault", MULTI_SIG_VAULT, deployer)
    const rebalancingPools = await ethers.getContractAt("RebalancingPools", REBALANCING_POOLS, deployer)
    const vaultAutomation = await ethers.getContractAt("VaultAutomation", VAULT_AUTOMATION, deployer)
    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        console.log("Verifying...");
        await verify(multiSigVault, [[deployer.address], 1]);
        await verify(rebalancingPools, []);
        await verify(vaultAutomation, [vaultAutomation.address, rebalancingPools.address]);
    }
}

async function main() {
    await getContracts();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});