# Smart Vault - Team Sierra

Smart Vault - Multi Signature Vault with rebalancing and compounding system.

## Vision

<h5>Problem:<h5>
DeFi users spend a lot of time on compounding yields and rebalancing their portfolio. They have many positions
which are difﬁcult to manage and remember in constantly changing DeFi environment.
<h5>Solution:<h5>
Automated rebalancing and yield compounding seems to be good answer for degen’s needs. Additionally it can be
secured by the multi signature vault singed by the wallets which can be distributed by the same person through
the different devices.
<h5>Goals:<h5>
- Allow DeFi users to have their entire positions in one place without need to frequent interactions.
- To have scalable architecture which can be easily maintained.
- Keep security on high level by multi signature feature.

<img title="SmartVault-InitialArchiteture" alt="Initial architecture for smart Vault" src="/images/SmartVault-InitialArchiteture.png">

<img title="SmartVault-InitialArchiteture" alt="Initial architecture for smart Vault" src="/images/SmartVault-UseCase.png">

## TODO (MVP)
- [ ] Vault
   - [ ] Deposit function
    - [ ] Withdrawal function
    - [ ] User storage
    - [ ] User mapping to pool
    - [ ] Swapping feature using routerV2
    - [ ] Configuration of pool (intervals, tokens, proportions to keep)
    - [ ] Creation of pool

- [ ] Rebalancing pool #1 
    - [ ] Interface for price feeds of ETH, WBTC and DAI
    - [ ] Storage mapping of tokens to USD value
    - [ ] Interfaces which provide amount of USD for mentioned assets and all pool

- [ ] Automation contract
    - [ ] CheckUpkeep function for calling rebalancing pool #1 token price interfaces
    - [ ] PerformUpkeep function for calling swaps in order to rebalancing pool #1 once needed

## TODO (Nice to have):
- [ ] Vault
    - [ ] Multi Signature feature
    - [ ] Swapping feature using curve, kyberswap
    - [ ] Advanced configuration (compounding intervals, multi signature feature enabled/disabled)
    - [ ] More tokens to choose for pool creation (some LP and yield tokens)

- [ ] Rebalancing pool #2
    - [ ] Additional interfaces in order to get prices new LP and yield tokens (additional querries from dexes)
    
- [ ] Automation Contract
    - [ ] Additional condition to check in CheckUpkeep for compounding
    - [ ] Compound functions for each new LP and yield tokens
    - [ ] PerformUpkeep update with compound functions
