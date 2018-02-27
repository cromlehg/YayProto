# Danger!!! Project can be scam

![YayProto](logo.png "YayProto")

# YayProto smart contract

* _Standart_        : ERC20
* _Name_            : YayProto
* _Ticket_          : YFN
* _Decimals_        : 18
* _Emission_        : Mintable
* _Crowdsales_      : 2
* _Fiat dependency_ : No
* _Tokens locked_   : Yes

## Smart-contracts description

Contract mint bounty and founders tokens after main sale stage finished. 
Crowdsale contracts have special function to retrieve transferred in errors tokens.
Also crowdsale contracts have special function to direct mint tokens in wei value (featue implemneted to support external pay gateway).

### Contracts contains
1. _YayProtoToken_ - Token contract
2. _Presale_ - Presale contract
3. _Mainsale_ - ICO contract
4. _Configurator_ - contract with main configuration for production

### How to manage contract
To start working with contract you should follow next steps:
1. Compile it in Remix with enamble optimization flag and compiler 0.4.18
2. Deploy bytecode with MyEtherWallet. Gas 5100000 (actually 5073514).
3. Call 'deploy' function on addres from (3). Gas 4000000 (actually 3979551). 

Contract manager must call finishMinting after each crowdsale milestone!
To support external mint service manager should specify address by calling _setDirectMintAgent_. After that specified address can direct mint VST tokens by calling _directMint_.

### How to invest
To purchase tokens investor should send ETH (more than minimum 0.1 ETH) to corresponding crowdsale contract.
Recommended GAS: 250000, GAS PRICE - 21 Gwei.

### Wallets with ERC20 support
1. MyEtherWallet - https://www.myetherwallet.com/
2. Parity 
3. Mist/Ethereum wallet

EXODUS not support ERC20, but have way to export key into MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

Investor must not use other wallets, coinmarkets or stocks. Can lose money.

## Main network configuration

* _Minimum invesment limit_     : 0.1 ETH
* _Price_                       : 7500 YPT per 1 ETH
* _Marketing tokens percent_    : 5% 
* _Developers tokens percent_   : 10% 
* _Advisors tokens percent_     : 10% 
* _Team tokens percent_         : 10%
* _For sale_                    : 65%

### Links
1. _Token_ - https://etherscan.io/address/0x6846c829d6645590bc877674b98c465a26462143
2. _Presale_ - https://etherscan.io/address/0x2dd35cbbbc058c37acf7821d2abde9595eb4c2c2
3. _Mainsale_ - https://etherscan.io/address/0x3ad041ebf3b2c2e518760372b2b22413bc029114

### Crowdsale stages

#### Presale
* _Hardcap_                    : 1700 ETH
* _Softcap_                    : 500 ETH
* _Start_                      : 12 February 2018 13:00:00 GMT
* _Wallet_                     : 0x00c286bFbEfa2e7D060259822EDceA2E922a2B7C
* _Contract owner_             : 0x004a35d1AA9aAd1f1dA1415FA28Cf9045A216c0A

_Milestones_
* 7 days - bonus 60%
* 7 days - bonus 50%
* 7 days - bonus 40%
* 7 days - bonus 30%
* 7 days - bonus 25%
* 7 days - bonus 20%

#### ICO
* _Hardcap_                    : 46 000 ETH
* _Start_                      : 23 April 2018 13:00:00 GMT
* _Wallet_                     : 0x009693f53723315219f681529fE6e05a91a28C41
* _Contract owner_             : 0x004a35d1AA9aAd1f1dA1415FA28Cf9045A216c0A
* _Developers tokens wallet_   : 0x0097895f899559D067016a3d61e3742c0da533ED
* _Team tokens wallet_         : 0x00137668FEda9d278A242C69aB520466A348C954
* _Marketing tokens wallet_    : 0x00A8a63f43ce630dbd3b96F1e040A730341bAa4D
* _Advisors tokensw wallet_    : 0x00764817d154237115DdA4FAA76C7aaB5dE3cb25


_Milestones_
* 7 days - bonus 15%
* 7 days - bonus 10%
* 7 days - bonus  7%
* 7 days - bonus  4%
* 7 days - without bonus


## Ropsten network configuration 

### links
1. _Token_ - https://ropsten.etherscan.io/address/0x2f7d7e0700f4109071ec83180ec13fabcb0e323a
2. _Presale_ - https://ropsten.etherscan.io/address/0xc58f8ba58c59a01e9d2f4d000fd439953210b821
3. _Mainsale_ - https://ropsten.etherscan.io/address/0xae4693a85eca2125519cc2c6824b2a3573b17721


### Crowdsale stages

#### Presale

* _Price_                    : 7500 YPT per 1 ETH
* _Minimal investment limit_ : 0.1 ETH
* _Softcap_                  : 3 ETH
* _Hardcap_                  : 6 ETH
* _Wallet_                   : 0x8fd94be56237ea9d854b23b78615775121dd1e82

_Milestones_

* 7 days - bonus 60%
* 7 days - bonus 50%
* 7 days - bonus 40%
* 7 days - bonus 30%
* 7 days - bonus 25%
* 7 days - bonus 20%


##### Purchasers

* 0.1 ETH => 750 tokens + 450 bonus tokens (60%), gas = 151997
https://ropsten.etherscan.io/tx/0x4e29b5c40d1d4ef30812c14dfaa79ffa0d2d52050776c64cadcbea304a110545

* 0.099 ETH => rejected txn, less then mininal investment limit, gas = 21270
https://ropsten.etherscan.io/tx/0x946956324248641601b07458857f381f43230fd18ecfea7e2645fedd779e1094

* 3 ETH => 2250 tokens + 1125 bonus tokens (50%), gas = 98652
https://ropsten.etherscan.io/tx/0xe9cba050db9a8b02156fb81cc5ef8583c21469e0258149c9c09b09127d626521

* 0.2 ETH => rejected txn, end of Presale, gas = 22528
https://ropsten.etherscan.io/tx/0x5ba8b4b82a757d050d1da62adb97b4b4931610dfbe445d4d067be41c01dbc5dc

##### Service operations

* setStart, gas = 27868
https://ropsten.etherscan.io/tx/0x0fb9d4b27f996c0d4954ac9a8d7e8c5e786b33c3ca6d95b056fdc4d87e7a9a9e

* setStart, gas = 27932
https://ropsten.etherscan.io/tx/0x1555fddb9176c7464346dad2bdefcb942ec9f75dbb16e3a282011158d34aecf7

* withdraw => 3.1 ETH to wallet, gas = 30262  
https://ropsten.etherscan.io/tx/0x1f6552b2b7d8c363e326bf95cd154971b4c23c914dacb8a293d661af92e46509

#### Mainsale
* _Price_                     : 7500 YPT per 1 ETH
* _Minimal investment limit_  : 0.1 ETH
* _Hardcap_                   : 6 ETH
* _Wallet_                    : 0x8fd94be56237ea9d854b23b78615775121dd1e82
* _Team tokens percent_       : 10%
* _Developers tokens percent_ : 10%
* _Advisors tokens percent_   : 10%
* _Marketing tokens percent_  : 5%
* _Team tokens wallet_        : 0x00137668feda9d278a242c69ab520466a348c954
* _Developers tokens wallet_  : 0x0097895f899559d067016a3d61e3742c0da533ed
* _Adwisors tokens wallet_    : 0x00764817d154237115dda4faa76c7aab5de3cb25
* _Marketing tokens wallet_   : 0x00a8a63f43ce630dbd3b96f1e040a730341baa4d

_Milestones_

* 7 days - bonus 15%
* 7 days - bonus 10%
* 7 days - bonus 7%
* 7 days - bonus 4%
* 7 days - without bonus

##### Purchasers
  
* 0.2 ETH => rejected txn, it is not Start yet, gas = 30000
https://ropsten.etherscan.io/tx/0xc93b23e3c72596129f0ea3411288af35f09aff4812b9d54ffec2d1bd3c52ab20

* 0.2 ETH => 1500 tokens + 225 bonus tokens (15%), gas = 88142
https://ropsten.etherscan.io/tx/0xf7ab152b6dcfcf8d5064a0863632bb2adc1683d559d1860e197f6003450747fc

##### Service operations

* setSaleAgent ,gas = 28598
https://ropsten.etherscan.io/tx/0xb1d4cba4c405ce8014c851448758e170ab83459d8626997cd1f3de8afe6aeba5

* setStart, gas = 28108
https://ropsten.etherscan.io/tx/0xf76bb2cec9c64ddd00930d274e5f86710ac8aef5ba9c6523d2207b10a1922a95

* finish, gas = 239654
https://ropsten.etherscan.io/tx/0x041f8f609bcc9dfe56cc6416e43072054d59969ea2d3a94fe0d0e0f59fba96fc

##### Token holders
https://ropsten.etherscan.io/token/0x2f7d7e0700f4109071ec83180ec13fabcb0e323a#balances
