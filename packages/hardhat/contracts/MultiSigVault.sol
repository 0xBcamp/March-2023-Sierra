//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interface/IUniswap.sol";
import "./interface/IERC20.sol";

contract multiSigVault {
  /// @notice ------------------events------------------
  event depositDone(address indexed sender, uint256 amount);
  event withdrawalID(uint256 indexed txID);

  /// @notice --------------state variables-------------
  address private constant Uniswap_V2_Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

  uint256 approvalLimit;
  address[] public addressesToSign;

  /// @notice ---------transaction details------------
  struct Transaction {
    address payable _to;
    uint256 amount;
    uint256 txID;
    address[] signers;
  }

  /// @notice -------mapping---------------
  mapping(address => bool) public isSigner;

  /// @notice -----------array of approved signers-------------
  address[] private signatures;
  Transaction[] public Transactions;

  /// @dev ------setting the list of signatory and approvalLimit of the vault-------------
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

  ///  @notice accepts any amount token into the vault
  function deposit() external payable {
    emit depositDone(msg.sender, msg.value);
  }

  /// @notice -----------return the balance of the contract----------------
  function getBalance() public view returns (uint256 balance) {
    return address(this).balance;
  }

  /// @notice -------------allows withdraw when approvalLimit is met----------
  function withdraw(uint256 txId) public payable returns (uint256) {
    require(txId < Transactions.length);
    address payable toSend = Transactions[txId]._to;
    require(address(this).balance >= Transactions[txId].amount, "You do not have enough funds");
    require(approvalLimit >= Transactions[txId].signers.length, "You do not have enough signatures");
    toSend.transfer(Transactions[txId].amount);

    emit withdrawalID(txId);
    return address(this).balance;
  }

  /// @notice Swapping an Exact Token for an Enough Token on the vault
  function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOutMin
  ) external returns (uint256 amountOut) {
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    IERC20(tokenIn).approve(Uniswap_V2_Router02, amountIn);

    address[] memory path;
    path = new address[](3);
    path[0] = tokenIn;
    path[1] = WETH;
    path[2] = tokenOut;

    uint256[] memory amounts = IUniswapV2Router(Uniswap_V2_Router02).swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      msg.sender,
      block.timestamp
    );

    /// Refund tokenIn when the expected minimum out is not met
    if (amountOutMin > amounts[2]) {
      IERC20(tokenIn).transfer(msg.sender, amounts[0]);
    }

    return amounts[2];
  }
}
