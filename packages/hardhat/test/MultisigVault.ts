import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MULTSIGVAULT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMULTSIGVAULTFixture() {

    const approvalLimit = 2
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VaultContract = await ethers.getContractFactory("multiSigVault");
    const vaultContract = await VaultContract.deploy( [owner.address, otherAccount.address], approvalLimit);

    return { vaultContract, owner, otherAccount, approvalLimit };
  }

  describe("Deployment", function () {
    it("Should set the right approvalLimit of the Signatory", async function () {
      const { vaultContract, approvalLimit } = await loadFixture(deployMULTSIGVAULTFixture);

      expect(await vaultContract.approvalLimit()).to.equal(approvalLimit);
    });

    it("Should set the right list of Signatories to the vault", async function () {
      const { vaultContract, owner, otherAccount } = await loadFixture(deployMULTSIGVAULTFixture);

      expect(await vaultContract.addressesToSign()).to.equal([owner.address, otherAccount.address]);
    });

    it("Should receive and store the funds to lock", async function () {
      const { vaultContract , owner} = await loadFixture(
        deployMULTSIGVAULTFixture
      );
      const amount = ethers.utils.parseEther("1") 
      await vaultContract.connect(owner).receive({ value: ethers.utils.parseEther("1") })

      expect(await ethers.provider.getBalance(vaultContract.address)).to.equal(
        amount
      );
    });

  });

 
});