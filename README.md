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

* _Minimal insvested limit_     : 0.1 ETH
* _Price_                       : 7500 YPT per 1 ETH
* _Marketing tokens percent_    : 5% 
* _Developers tokens percent_   : 10% 
* _Advisors tokens percent_     : 10% 
* _Team tokens wallet_          : 10%
* _For sale_                    : 65%

### Links
1. _Token_ -
2. _Presale_ -
3. _Mainsale_ -

### Crowdsale stages

#### Presale
* _Hardcap_                    : 11 250 ETH
* _Softcap_                    : 3000 ETH
* _Start_                      : 31 Jan 2018 00:00:00 GMT
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
* _Hardcap_                    : 95 000 ETH
* _Start_                      : 
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

