//SPDX-License-Identifier
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract VaultAutomation {
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
    performData = abi.encode(0);
    uint256 checkOption = abi.decode(checkData, (uint256));
    if (checkOption == 1) // Upkeep for pool#1
    {

    }

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
    (bool upkeepNeeded, bytes memory data) = checkUpkeep(abi.encode(1));
    uint256 checkOption = abi.decode(performData, (uint256));

    // Prevents from calling by other actor when conditions from checkUpkeep are not met
    if ((abi.decode(data, (uint256)) != checkOption) || (!upkeepNeeded)) {
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
  }
}
