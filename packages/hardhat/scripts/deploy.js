// deploy/00_deploy_example_external_contract.js

const { ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config")

const main = async () => {
  //const { deploy } = deployments;
  const { deployer } = await ethers.getSigners();
  const chainId = network.config.chainId;
  const MultiSigVault = await ethers.getContractFactory("MultiSigVault");
  console.log(`Deploying vault contract by ${accounts[0].address}...`);
  const multiSigVault = await MultiSigVault.deploy([accounts[0].address], 1);
  // await deploy("MultiSigVault", {
  //   // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //   from: deployer,
  //   args: [[deployer], 1],
  //   log: true,
  // });

  //const multiSigVault = await ethers.getContract("MultiSigVault");
  const rebalancingPools = await ethers.getContractAt("RebalancingPools", await multiSigVault.getRebalancingPoolsAddress());

  let tx = await multiSigVault.setDai(networkConfig[chainId]["dai"]);
  tx.wait();
  tx = await multiSigVault.setAcceptableToken(networkConfig[chainId]["wmatic"]);
  tx.wait();
  tx = await multiSigVault.setRouter(networkConfig[chainId]["sushiswap_router_v2"]);
  tx.wait();

  tx = await rebalancingPools.setAvailableTokens([
    networkConfig[chainId]["wmatic"],
    networkConfig[chainId]["dai"]]);
  tx.wait();

  tx = await rebalancingPools.setPriceFeeds([
    networkConfig[chainId]["maticUsdPriceFeed"],
    networkConfig[chainId]["daiUsdPriceFeed"]]);
  tx.wait();

  tx = await rebalancingPools.createInitialMapping();
  tx.wait();

  // Getting a previously deployed contract
  // const ExampleExternalContract = await ethers.getContract(
  //   "ExampleExternalContract",
  //   deployer
  // );

  // await YourContract.setPurpose("Hello");

  // if you want to instantiate a version of a contract at a specific address!
  // const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A")

  // If you want to send value to an address from the deployer
  // const deployerWallet = ethers.provider.getSigner()
  // await deployerWallet.sendTransaction({
  //   to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  //   value: ethers.utils.parseEther("0.001")
  // })

  // If you want to send some ETH to a contract on deploy (make your constructor payable!)
  // const yourContract = await deploy("YourContract", [], {
  // value: ethers.utils.parseEther("0.05")
  // });

  // If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  // const yourContract = await deploy("YourContract", [], {}, {
  //  LibraryName: **LibraryAddress**
  // });

  // todo: verification with etherscan
  // Verification
  // if (chainId !== "31337") {
  //   try {
  //     console.log(" 🎫 Verifing Contract on Etherscan... ");
  //     await sleep(5000); // wait 5 seconds for deployment to propagate
  //     await run("verify:verify", {
  //       address: ExampleExternalContract.address,
  //       contract:
  //         "contracts/ExampleExternalContract.sol:ExampleExternalContract",
  //       contractArguments: [],
  //     });
  //   } catch (error) {
  //     console.log("⚠️ Contract Verification Failed: ", error);
  //   }
  // }
};

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });