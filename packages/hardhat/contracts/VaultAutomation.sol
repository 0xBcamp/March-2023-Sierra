//SPDX-License-Identifier
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./RebalancingPools.sol";
import "./MultiSigVault.sol";

contract VaultAutomation {
  uint256 constant REBALANCE = 0x1;
  uint256 constant COMPOUND = 0x2;
  MultiSigVault immutable multiSigVault;
  RebalancingPools immutable rebalancingPools;

  constructor(address _vault, address _rebalancingPools) {
    multiSigVault = MultiSigVault(_vault);
    rebalancingPools = RebalancingPools(_rebalancingPools);
  }

  /**
   * @dev This is the function that the Chainlink Keeper nodes call
   * they look for the "upkeepNeeded" to return true for distribution:
   * I.The following should be true in order to return true:
   * 1. Proportions of the tokens must be violated - some token exceeded in number limits
   * 2. Yield to compound exceeded some limit
   * 3. Our subscription should be funded with LINK -> NOT DONE
   * @param checkData - used to determine which functionality should be done in the checkUpkeep function
   * Each pool should have its own checkdata byte representation
   */

  function checkUpkeep(
    bytes memory checkData
  )
    public
    view
    returns (
      /* override */
      bool upkeepNeeded,
      bytes memory performData
    )
  {
    upkeepNeeded = false;
    bool rebalanceNeeded = false;
    address[] memory users = multiSigVault.getVaultUsers();
    uint256 checkOption = abi.decode(checkData, (uint256));
    uint256 idx = 0;
    if (checkOption == REBALANCE) // Upkeep for pool#1
    {
      for (; idx < users.length; idx++) {
        (rebalanceNeeded, , ) = rebalancingPools.checkPercentageProportions(users[idx]);
        if (rebalanceNeeded) {
          break;
        }
      }
    }
    performData = abi.encode(idx);
    return (upkeepNeeded, performData);
  }

  /** @dev Function suppose to be called automatically by the chainlink keepers once
   * checkUpkeep returns true (condtition fulfilled). But it can also be called by other
   * actors and this is not an issue because it is build-in checks which will prevent
   * from calling during wrong conditions.
   *
   * @param performData - used to determine which functionality should be done in the performUpkeep function
   * and increase possibilities for debug by error codes
   */
  function performUpkeep(bytes calldata performData) external /* override */ {
    (bool rebalanceNeeded, bytes memory data) = checkUpkeep(abi.encode(REBALANCE));
    uint256 idx = abi.decode(performData, (uint256));
    address[] memory users = multiSigVault.getVaultUsers();
    // Prevents from calling by other actor when conditions from checkUpkeep are not met
    if ((abi.decode(data, (uint256)) != idx) || (!rebalanceNeeded)) {
      //revert
    }

    // Error handling
    /*if (checkOption == ??) {
            revert 
            );
        } else if () {
            revert
        }*/

    // Main flow
    rebalancingPools.rebalance(users[idx]);
  }
}
