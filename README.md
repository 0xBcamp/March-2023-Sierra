# Smart Vault - Team Sierra

Smart Vault - Multi Signature Vault with rebalancing and compounding system.

## Vision

<h5>Problem:</h5>
DeFi users spend a lot of time on compounding yields and rebalancing their portfolio. They have many positions
which are difﬁcult to manage and remember in constantly changing DeFi environment.
<h5>Solution:</h5>
Automated rebalancing and yield compounding seems to be good answer for degen’s needs. Additionally it can be
secured by the multi signature vault singed by the wallets which can be distributed by the same person through
the different devices.
<h5>Goals:</h5>
- Allow DeFi users to have their entire positions in one place without need to frequent interactions.
- To have scalable architecture which can be easily maintained.
- Keep security on high level by multi signature feature.

<h5>Initial architecture for Smart Vault</h5>
<img title="SmartVault-InitialArchiteture" alt="Initial architecture for Smart Vault" src="/images/SmartVault-InitialArchiteture.png">
<h5>General use case of Smart Vault</h5>
<img title="SmartVault-UseCase" alt="General use case of Smart Vault" src="/images/SmartVault-UseCase.png">

## TODO (MVP)
- [ ] Vault
    - [x] Deposit function
    - [ ] Withdrawal function
    - [x] User storage
    - [x] Swapping feature using routerV2
    - [x] Configuration of pool (intervals, tokens, proportions to keep)
    - [x] Creation of pool

- [x] Rebalancing pools
    - [x] Interface for price feeds of ETH, WBTC and DAI
    - [x] Storage mapping of tokens to USD value
    - [x] User mapping to pool
    - [x] Interfaces which provide amount of USD for mentioned assets and all pool
    - [x] Working rebalance function

- [x] Automation contract
    - [x] CheckUpkeep function for calling rebalancing pool #1 token price interfaces
    - [x] PerformUpkeep function for calling swaps in order to rebalancing pool #1 once needed (rebalance function was not working)

## TODO (Nice to have):
- [ ] Vault
    - [ ] Multi Signature feature
    - [ ] Swapping feature using curve, kyberswap
    - [ ] Advanced configuration (compounding intervals, multi signature feature enabled/disabled)
    - [ ] More tokens to choose for pool creation (some LP and yield tokens)

- [ ] Rebalancing pools
    - [ ] Additional interfaces in order to get prices new LP and yield tokens (additional querries from dexes)
    
- [ ] Automation Contract
    - [ ] Additional condition to check in CheckUpkeep for compounding
    - [ ] Compound functions for each new LP and yield tokens
    - [ ] PerformUpkeep update with compound functions
