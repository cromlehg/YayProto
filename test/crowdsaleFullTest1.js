
import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const Token = artifacts.require('LightcashCryptoToken')

const Mainsale = artifacts.require('TGE')

const Presale = artifacts.require('PreTGE')

contract('Crowdsale', function(wallets) {

  const owner = wallets[0]

  const extraTokensWallet = "0xF0e830148F3d1C4656770DAa282Fda6FAAA0Fe0B";

  const presaleETHWallet = "0xDFDCAc0c9Eb45C63Bcff91220A48684882F1DAd0";

  const mainsaleETHWallet = "0x3aC45b49A4D3CB35022fd8122Fd865cd1B47932f";

  const summaryTokensK = extraTokensK

  const presaleStart = 1515416400;

  const mainsaleStart = 1516024800;

  const basePresalePrice = ether(1250)

  const baseMainsalePrice = ether(1000)

  const softcap = new BigNumber(75000000000000000000000)

  const softcapInETH = new BigNumber(softcap).div(basePresalePrice).mul(ether(1))

  const day = 60 * 60 * 24

  const week = 7*day

  const extraTokensPercent = new BigNumber(5)

  const PERCENT_RATE = new BigNumber(100)

  const presalePeriod = 7

  const extraTokensK = extraTokensPercent.div(PERCENT_RATE)

  const defInvestor = wallets[1]

  const minInvestedPresale = ether(0.01)

  const minInvestedMainsale = ether(0.01)
 
  const extInvestorPresale = wallets[2]

  const transferredK = new BigNumber(0.5)

  const presaleInvestorsStartIndex = 3

  const mainsaleInvestorsStartIndex = 10

  const defValue = ether(3)


  before(async function() {
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.token = await Token.new()
    this.presale = await Presale.new()
    this.mainsale = await Mainsale.new()

    await this.presale.setPrice(basePresalePrice);
    await this.presale.setMinPurchaseLimit(minInvestedPresale);
    await this.presale.setSoftcap(softcap);
    await this.presale.setHardcap(37500000000000000000000000);
    await this.presale.setStart(presaleStart);
    await this.presale.setPeriod(presalePeriod);
    await this.presale.setWallet(presaleETHWallet);
    await this.presale.setRefererPercent(5);

    await this.mainsale.setPrice(baseMainsalePrice);
    await this.mainsale.setMinPurchaseLimit(minInvestedMainsale);
    await this.mainsale.setHardcap(105000000000000000000000000);
    await this.mainsale.setStart(mainsaleStart);
    await this.mainsale.setWallet(mainsaleETHWallet);
    await this.mainsale.setExtraTokensWallet(extraTokensWallet);
    await this.mainsale.setExtraTokensPercent(extraTokensPercent);
    await this.mainsale.addStage(10, 20);
    await this.mainsale.addStage(10, 10);
    await this.mainsale.addStage(10, 0);
    await this.mainsale.setRefererPercent(5);
    await this.mainsale.setExtraTokensLockPeriod(100);

    await this.token.setSaleAgent(this.presale.address)
    await this.presale.setToken(this.token.address)
    await this.mainsale.setToken(this.token.address)
    await this.presale.setNextSaleAgent(this.mainsale.address)
    await this.token.transferOwnership(owner)
    await this.presale.transferOwnership(owner)
    await this.mainsale.transferOwnership(owner)
  })	 
  
  it('Integration test', async function () {

    var presaleStages = [
	    {'start': presaleStart, 'period': 7, 'invested': 0, 'investors': [
		    { 'address'              : wallets[presaleInvestorsStartIndex    ], 
			    'invested'             : ether(10), 
			    'tokens'               : basePresalePrice.mul(10), 
			    'afterSummaryInvested' : ether(10),
          'afterActualInvested'  : ether(10),
          'totalSupply'          : basePresalePrice.mul(10)},
        { 'address'              : wallets[presaleInvestorsStartIndex + 1], 
			    'invested'             : ether(10), 
			    'tokens'               : basePresalePrice.mul(10), 
			    'afterSummaryInvested' : ether(20),
          'afterActualInvested'  : ether(10),
          'totalSupply'          : basePresalePrice.mul(10).mul(2)}
	    ] }
    ]

    console.log('Presale checks.') 
	  
    var currentSale = this.presale
    var minInvestedLimit = minInvestedPresale
    var stages = presaleStages

    console.log('Rejects before start.')
    await currentSale.sendTransaction({from: defInvestor, value: defValue}).should.be.rejectedWith(EVMThrow)

    console.log('Check min invested limit.') 
    var minInvestedLimitFromContract = await currentSale.minPurchaseLimit()
    minInvestedLimitFromContract.should.be.bignumber.equal(minInvestedLimit)

    console.log('Check base price.') 
    var basePriceFromContract = await currentSale.price()
    basePriceFromContract.should.be.bignumber.equal(basePresalePrice)

    for(var i = 0; i < stages.length; i++) {
      console.log('Check ' + i + ' stage.')
      let stage = stages[i]

      console.log('Period ' + stage['period'] + ' days, start ' + stage['start'])
      
      console.log('Increase time to selected stage.')
      await increaseTimeTo(stage['start'])

      console.log('Check current stage.')
      const stagePeriod = await currentSale.period()
      stagePeriod.should.be.bignumber.equal(stage['period'])

      var investor = stage['investors'][0]

      console.log('Investor ' + investor['address'] + ' try to invest ' + investor['invested'] + ' in ETH.')

      await currentSale.sendTransaction({from: investor['address'], value: investor['invested']}).should.be.fulfilled

      console.log('Check investor tokens balance.')
      var balanceOf = await this.token.balanceOf(investor['address'])
      balanceOf.should.be.bignumber.equal(investor['tokens'])

      console.log('Check summary minted.')
      var totalSupply = await this.token.totalSupply()
      totalSupply.should.be.bignumber.equal(investor['totalSupply']) 

      console.log('Check contract balance.')
      var curContractBalance = await web3.eth.getBalance(currentSale.address)
      curContractBalance.should.be.bignumber.equal(investor['afterActualInvested'])

      console.log('Check contract invest field balance.')
      curContractBalance = await currentSale.invested()
      curContractBalance.should.be.bignumber.equal(investor['afterSummaryInvested'])

      console.log('Check softcap not achieved.')
      var achieved = await currentSale.softcapAchieved()
      achieved.should.equal(false)
	    
      investor = stage['investors'][1]

      console.log('Investor ' + investor['address'] + ' try to invest ' + investor['invested'] + ' in alternative coins.')

      await currentSale.directMint(investor['address'], investor['invested'], {from: owner}).should.be.fulfilled

      console.log('Check rejection during not owner try to call direct mint')	    
      await currentSale.directMint(investor['address'], investor['invested'], {from: investor['address']}).should.be.rejectedWith(EVMThrow)

      console.log('Check investor tokens balance.')
      balanceOf = await this.token.balanceOf(investor['address'])
      balanceOf.should.be.bignumber.equal(investor['tokens'])

      console.log('Check summary minted.')
      totalSupply = await this.token.totalSupply()
      totalSupply.should.be.bignumber.equal(investor['totalSupply']) 

      console.log('Check contract balance.')
      curContractBalance = await web3.eth.getBalance(currentSale.address)
      curContractBalance.should.be.bignumber.equal(investor['afterActualInvested'])

      console.log('Check contract invest field balance.')
      curContractBalance = await currentSale.invested()
      curContractBalance.should.be.bignumber.equal(investor['afterSummaryInvested'])

      console.log('Check rejection of transfer operation.')
      var transferredValue = investor['tokens'].mul(transferredK)
      await this.token.transfer(defInvestor, transferredValue, {from: investor['address']}).should.be.rejectedWith(EVMThrow)

      console.log('Check softcap not achieved.')
      achieved = await currentSale.softcapAchieved()
      achieved.should.equal(false)

      console.log('Check reject widthraw')
      await this.presale.widthraw({from: owner}).should.be.rejectedWith(EVMThrow) 
	    
    }

    console.log('Jump to widthdraw.')

    console.log('Invest to softcap ' + softcapInETH + ' ETH.')
    const defInvestorBalance = await web3.eth.getBalance(defInvestor)
    console.log('Def investor balance ' + defInvestorBalance)
    await this.presale.sendTransaction({from: defInvestor, value: softcapInETH}).should.be.fulfilled

    console.log('Check investor balance.')
    const softcapMinted = softcap	  
    var tempInvestorMinted = softcapMinted
    var tempBalanceOf = await this.token.balanceOf(defInvestor)
    tempBalanceOf.should.be.bignumber.equal(tempInvestorMinted)

    console.log('Check summary presale minted.')
    var tempSummaryMinted = stages[0]['investors'][1]['totalSupply'].add(softcapMinted)
    var tempTotalSupply = await this.token.totalSupply()
    tempTotalSupply.should.be.bignumber.equal(tempSummaryMinted) 

    console.log('Check presale softcap.')
    const softcapFromContract = await currentSale.softcap()
    softcapFromContract.should.be.bignumber.equal(softcap)

    console.log('Check softcap achieved.')
    var achieved = await this.presale.softcapAchieved()
    achieved.should.equal(true)

    console.log('Check contract balance.')
    var tempCurContractBalance = await web3.eth.getBalance(currentSale.address)
    console.log('Contract balance: ' + tempCurContractBalance)
    console.log('Expected contract balance: ' + stages[0]['investors'][1]['afterActualInvested'].add(softcapInETH))
    tempCurContractBalance.should.be.bignumber.equal(stages[0]['investors'][1]['afterActualInvested'].add(softcapInETH))

    console.log('Check widthraw works.')
    await this.presale.widthraw().should.be.fulfilled

    console.log('Check wallet balance.')
    var curMasterBalance = await web3.eth.getBalance(presaleETHWallet)
    var localMasterBalance = tempCurContractBalance
    curMasterBalance.should.be.bignumber.equal(curMasterBalance)

    console.log('Check contract zero balance.')
    tempCurContractBalance = await web3.eth.getBalance(currentSale.address)
    tempCurContractBalance.should.be.bignumber.equal(ether(0))

    var saleEnd = presaleStart + week

    console.log('Increase time to sale end.')
    await increaseTimeTo(saleEnd)

    console.log('Check rejection after sale end.')
    await currentSale.sendTransaction({from: defInvestor, value: defValue}).should.be.rejectedWith(EVMThrow)

    console.log('Finish current sale.')
    await currentSale.finish().should.be.fulfilled

    console.log('Check rejection after sale finished.')
    await currentSale.sendTransaction({from: defInvestor, value: defValue}).should.be.rejectedWith(EVMThrow)

    var allTokens = await this.token.totalSupply()
/*
    var mainsaleStages = [
	    {'start': mainsaleStart, 'discount': 20, 'period': 7, 'invested': 0, 'hardcap': ether(2850), 'investors': [
        { 'address'              : wallets[mainsaleInvestorsStartIndex    ], 
			    'invested'             : ether(8), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(8),
		      'afterActualInvested'  : ether(8),
		      'totalSupply'          : allTokens.add(basePrice.mul(10))},
        { 'address'              : wallets[mainsaleInvestorsStartIndex + 1], 
			    'invested'             : ether(8), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(16),
		      'afterActualInvested'  : ether(8),
		      'totalSupply'          : allTokens.add(basePrice.mul(10).mul(2))}
	    ] }, 

	    {'start': mainsaleStart + week, 'discount': 10, 'period': 7, 'invested': 0, 'hardcap': ether(5700), 'investors': [

		    {       'address'              : wallets[mainsaleInvestorsStartIndex + 2], 
			    'invested'             : ether(9), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(25),
		            'afterActualInvested'  : ether(17),
		            'totalSupply'          : allTokens.add(basePrice.mul(10).mul(3))},

	            {       'address'              : wallets[mainsaleInvestorsStartIndex + 3], 
			    'invested'             : ether(9), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(34),
		            'afterActualInvested'  : ether(17),
		            'totalSupply'          : allTokens.add(basePrice.mul(10).mul(4))}

	    ] }, 

	    {'start': mainsaleStart + 2*week, 'discount': 0, 'period': 7, 'invested': 0, 'hardcap': ether(18280), 'investors': [

		    {       'address'              : wallets[mainsaleInvestorsStartIndex + 4], 
			    'invested'             : ether(10), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(44),
		            'afterActualInvested'  : ether(31),
		            'totalSupply'          : allTokens.add(basePrice.mul(10).mul(5))},

	            {       'address'              : wallets[mainsaleInvestorsStartIndex + 5], 
			    'invested'             : ether(10), 
			    'tokens'               : basePrice.mul(10), 
			    'afterSummaryInvested' : ether(54),
		            'afterActualInvested'  : ether(31),
		            'totalSupply'          : allTokens.add(basePrice.mul(10).mul(6))}

	    ] }

    ]


    console.log('Mainsale checks.') 
	  
    var currentSale = this.mainsale
    var minInvestedLimit = minInvestedMainsale
    var stages = mainsaleStages;	  

    console.log('Rejects before start.')
    await currentSale.sendTransaction({from: defInvestor, value: defValue}).should.be.rejectedWith(EVMThrow)
    await currentSale.directMint(defInvestor, defValue, {from: owner}).should.be.rejectedWith(EVMThrow)

    console.log('Check min invested limit.') 
    var minInvestedLimitFromContract = await currentSale.minInvestedLimit()
    minInvestedLimitFromContract.should.be.bignumber.equal(minInvestedLimit)

    console.log('Check base price.') 
    var basePriceFromContract = await currentSale.price()
    basePriceFromContract.should.be.bignumber.equal(basePrice)

    for(var i = 0; i < stages.length; i++) {
      console.log('Check ' + i + ' stage.')
      let stage = stages[i]

      console.log('Discount ' + stage['discount'] + '%, period ' + stage['period'] + ' days, start ' + stage['start'])
      
      var stageFromContract = await currentSale.stages(i)
      stageFromContract[0].should.be.bignumber.equal(stage['period'])
      stageFromContract[1].should.be.bignumber.equal(stage['hardcap'])
      stageFromContract[2].should.be.bignumber.equal(stage['discount'])

      console.log('Increase time to selected stage.')
      await increaseTimeTo(stage['start'])

      console.log('Check current stage.')
      let stageFromContractIndex = await currentSale.currentStage()
      stageFromContractIndex.should.be.bignumber.equal(i)
      stageFromContract = await currentSale.stages(stageFromContractIndex)
      stageFromContract[0].should.be.bignumber.equal(stage['period'])
      stageFromContract[1].should.be.bignumber.equal(stage['hardcap'])
      stageFromContract[2].should.be.bignumber.equal(stage['discount'])

      var investor = stage['investors'][0]

      console.log('Investor ' + investor['address'] + ' try to invest ' + investor['invested'] + ' in ETH.')

      await currentSale.sendTransaction({from: investor['address'], value: investor['invested']}).should.be.fulfilled

      console.log('Check investor tokens balance.')
      var balanceOf = await this.token.balanceOf(investor['address'])
      balanceOf.should.be.bignumber.equal(investor['tokens'])

      console.log('Check summary minted.')
      var totalSupply = await this.token.totalSupply()
      totalSupply.should.be.bignumber.equal(investor['totalSupply']) 

      tempCurContractBalance = investor['afterActualInvested']

      console.log('Check master wallet balance.')
      var curMasterBalance = await web3.eth.getBalance(masterWallet)
      var localMasterBalance = tempCurContractBalance.mul(masterWalletK)
      curMasterBalance.should.be.bignumber.equal(curMasterBalance)

      console.log('Check sec wallet balance.')
      var curSecBalance = await web3.eth.getBalance(secWallet)
      var localSecBalance = tempCurContractBalance.mul(secWalletK)
      curSecBalance.should.be.bignumber.equal(curSecBalance)

      console.log('Check dev wallet balance.')
      var curDevBalance = await web3.eth.getBalance(devWallet)
      var localDevBalance = tempCurContractBalance.mul(devWalletK)
      curDevBalance.should.be.bignumber.equal(curDevBalance)

      console.log('Check contract invest field balance.')
      curContractBalance = await currentSale.invested()
      curContractBalance.should.be.bignumber.equal(investor['afterSummaryInvested'])

      investor = stage['investors'][1]

      console.log('Investor ' + investor['address'] + ' try to invest ' + investor['invested'] + ' in alternative coins.')

      await currentSale.directMint(investor['address'], investor['invested'], {from: owner}).should.be.fulfilled

      console.log('Check rejection during not owner try to call direct mint')	    
      await currentSale.directMint(investor['address'], investor['invested'], {from: investor['address']}).should.be.rejectedWith(EVMThrow)

      console.log('Check investor tokens balance.')
      balanceOf = await this.token.balanceOf(investor['address'])
      balanceOf.should.be.bignumber.equal(investor['tokens'])

      console.log('Check summary minted.')
      totalSupply = await this.token.totalSupply()
      totalSupply.should.be.bignumber.equal(investor['totalSupply']) 

      tempCurContractBalance = investor['afterActualInvested']

      console.log('Check master wallet balance.')
      curMasterBalance = await web3.eth.getBalance(masterWallet)
      localMasterBalance = tempCurContractBalance.mul(masterWalletK)
      curMasterBalance.should.be.bignumber.equal(curMasterBalance)

      console.log('Check sec wallet balance.')
      curSecBalance = await web3.eth.getBalance(secWallet)
      localSecBalance = tempCurContractBalance.mul(secWalletK)
      curSecBalance.should.be.bignumber.equal(curSecBalance)

      console.log('Check dev wallet balance.')
      curDevBalance = await web3.eth.getBalance(devWallet)
      localDevBalance = tempCurContractBalance.mul(devWalletK)
      curDevBalance.should.be.bignumber.equal(curDevBalance)

      console.log('Check contract invest field balance.')
      curContractBalance = await currentSale.invested()
      curContractBalance.should.be.bignumber.equal(investor['afterSummaryInvested'])

      console.log('Check contract minted field balance.')
      curContractBalance = await currentSale.minted()
      curContractBalance.should.be.bignumber.equal(investor['totalSupply'].sub(allTokens))

      console.log('Check rejection of transfer operation.')
      var transferredValue = investor['tokens'].mul(transferredK)
      await this.token.transfer(defInvestor, transferredValue, {from: investor['address']}).should.be.rejectedWith(EVMThrow)

    }

    tempSummaryMinted = stages[2]['investors'][1]['totalSupply'].sub(allTokens)
    allTokens = stages[2]['investors'][1]['totalSupply']

    console.log('Check summary minted.')
    tempTotalSupply = await this.token.totalSupply()
    tempTotalSupply.should.be.bignumber.equal(allTokens) 

    console.log('Check summary mainsale minted.')
    var currentSaleMinted = await currentSale.minted()	  
    currentSaleMinted.should.be.bignumber.equal(tempSummaryMinted) 

    console.log('Check contract invest field balance.')
    curContractBalance = await currentSale.invested()
    curContractBalance.should.be.bignumber.equal(stages[2]['investors'][1]['afterSummaryInvested'])

    tempCurContractBalance = stages[2]['investors'][1]['afterActualInvested']

    console.log('Check master wallet balance.')
    curMasterBalance = await web3.eth.getBalance(masterWallet)
    localMasterBalance = tempCurContractBalance.mul(masterWalletK)
    curMasterBalance.should.be.bignumber.equal(curMasterBalance)

    console.log('Check sec wallet balance.')
    curSecBalance = await web3.eth.getBalance(secWallet)
    localSecBalance = tempCurContractBalance.mul(secWalletK)
    curSecBalance.should.be.bignumber.equal(curSecBalance)

    console.log('Check dev wallet balance.')
    curDevBalance = await web3.eth.getBalance(devWallet)
    localDevBalance = tempCurContractBalance.mul(devWalletK)
    curDevBalance.should.be.bignumber.equal(curDevBalance)

    console.log('Check contract zero balance.')
    tempCurContractBalance = await web3.eth.getBalance(currentSale.address)
    tempCurContractBalance.should.be.bignumber.equal(ether(0))

    var saleEnd = mainsaleStart + 3*week

    console.log('Increase time to sale end.')
    await increaseTimeTo(saleEnd)

    console.log('Check rejection after sale end.')
    await currentSale.sendTransaction({from: defInvestor, value: defValue}).should.be.rejectedWith(EVMThrow)

    console.log('Finish current sale.')
    await currentSale.finishMinting().should.be.fulfilled
   
    tempSummaryMinted = tempSummaryMinted.div((new BigNumber(1)).sub(summaryTokensK))
    allTokens = await this.presale.minted()
    allTokens = allTokens.add(tempSummaryMinted)

    var filter = new BigNumber(1000000)

    console.log('Check summary minted.')
    tempTotalSupply = await this.token.totalSupply()
    tempTotalSupply.div(filter).toFixed(0).should.be.bignumber.equal(allTokens.div(filter).toFixed(0)) 

    console.log('Check summary mainsale minted.')
    var currentSaleMinted = await currentSale.minted()	  
    currentSaleMinted.div(filter).toFixed(0).should.be.bignumber.equal(tempSummaryMinted.div(filter).toFixed(0)) 


    devTokensWallet = "0x97f2f8a94986d9049147590e12a64ffaa9f946a8"

    secTokensWallet = "0xc76b0d5bbc2bf9b760ebd797dacd3a683cb8498f"

    bountyTokensWallet = "0x872215ccf488031991f7dcc65e80a7c1fd497e75"

    foundersTokensWallet = "0x49ecc9e56979c884b28d8c791890e279ab1ec5f4"

    growthTokensWallet = "0x59ecc9e56979c884b28d8c791890e279ab1ec5f4"

    advisorsTokensWallet = "0x7bb6dbc29f8adb3a7627ea65372fe471509b7698"

    console.log('Check bounty tokens.')
    bountyTokens = tempSummaryMinted.mul(bountyTokensK)
    bountyTokensFromContract = await this.token.balanceOf(bountyTokensWallet)
    bountyTokensFromContract.toFixed(0).should.be.bignumber.equal(bountyTokens.toFixed(0))

    console.log('Check dev tokens.')
    devTokens = tempSummaryMinted.mul(devTokensK)
    devTokensFromContract = await this.token.balanceOf(devTokensWallet)
    devTokensFromContract.toFixed(0).should.be.bignumber.equal(devTokens.toFixed(0))

    console.log('Check founders tokens.')
    foundersTokens = tempSummaryMinted.mul(foundersTokensK)
    foundersTokensFromContract = await this.token.balanceOf(foundersTokensWallet)
    foundersTokensFromContract.toFixed(0).should.be.bignumber.equal(foundersTokens.toFixed(0))

    console.log('Check advisors tokens.')
    advisorsTokens = tempSummaryMinted.mul(advisorsTokensK)
    advisorsTokensFromContract = await this.token.balanceOf(advisorsTokensWallet)
    advisorsTokensFromContract.toFixed(0).should.be.bignumber.equal(advisorsTokens.toFixed(0))

    console.log('Check growth tokens.')
    growthTokens = tempSummaryMinted.mul(growthTokensK)
    growthTokensFromContract = await this.token.balanceOf(growthTokensWallet)
    growthTokensFromContract.toFixed(0).should.be.bignumber.equal(growthTokens.toFixed(0))

    console.log('Check sec tokens.')
    secTokens = tempSummaryMinted.mul(secTokensK)
    secTokensFromContract = await this.token.balanceOf(secTokensWallet)
    secTokensFromContract.toFixed(0).should.be.bignumber.equal(secTokens.toFixed(0))

    console.log('Check tokens transfer')	  
    transferredValue = softcapMinted.mul(new BigNumber(0.5))
    await this.token.transfer(owner, transferredValue, {from: defInvestor}).should.be.fulfilled

    console.log('Check tokens balances after transfer')	  
    var currentTokens = softcapMinted.sub(transferredValue)
    var defInvTokens = await this.token.balanceOf(defInvestor)
    defInvTokens.should.be.bignumber.equal(currentTokens)

    var currentTokensOwner = softcapMinted.sub(currentTokens)
    var ownerTokens = await this.token.balanceOf(owner)
    ownerTokens.should.be.bignumber.equal(currentTokensOwner)

    console.log('Finished!')	  
*/

  })

})
