//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract MultiSigVault {
  event depositDone(address indexed user, uint256 amount);

  uint256 approvalLimit;
  address[] public addressesToSign;

  struct Transaction {
    address payable _to;
    uint256 amount;
    uint256 txID;
    address[] signers;
  }

  mapping(address => bool) public isSigner;

  address[] signatures;
  Transaction[] public Transactions;

  constructor(address[] memory _addressesToSign, uint256 _approvalLimit) {
    require(_addressesToSign.length > 0, "Invalid Number of signer");
    require(_approvalLimit > 0 && _addressesToSign.length <= signatures.length, "Invalid Approval Limit");

    for (uint256 i; i < _addressesToSign.length; i++) {
      address toSign = _addressesToSign[i];

      require(toSign != address(0), "invalid address");
      require(!isSigner[toSign], "Address is a Signatory To Wallet");

      isSigner[toSign] = true;

      addressesToSign.push(toSign);
    }

    approvalLimit = _approvalLimit;
  }

  function deposit() external payable {
    emit depositDone(msg.sender, msg.value);
  }

  function getBalance() public view returns (uint256 balance) {
    return address(this).balance;
  }

  function withdraw(uint256 txId) public payable returns (uint256) {
    require(txId < Transactions.length);
    address payable toSend = Transactions[txId]._to;
    require(address(this).balance >= Transactions[txId].amount, "You do not have enough funds");
    require(approvalLimit >= Transactions[txId].signers.length, "You do not have enough signatures");
    toSend.transfer(Transactions[txId].amount);
    return address(this).balance;
  }
}
