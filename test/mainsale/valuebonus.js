import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

export default function (Token, Crowdsale, wallets) {
  let token;
  let crowdsale;
  const milestones = [
    {value: 2, bonus: 2},
    {value: 11, bonus: 3},
    {value: 51, bonus: 5},
    {value: 98, bonus: 7}
  ];

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime();
    this.duration = 30;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(3937.0078);
    this.hardcap = ether(30);
    this.minInvestmentLimit = ether(0.03);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setMinInvestedLimit(this.minInvestmentLimit);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.setPercentRate(10000000);
    await crowdsale.addMilestone(9, 0);
    await crowdsale.addValueBonus(ether(2), 200000);
    await crowdsale.addValueBonus(ether(11), 300000);
    await crowdsale.addValueBonus(ether(51), 500000);
    await crowdsale.addValueBonus(ether(98), 700000);
    await crowdsale.addValueBonus(ether(301), 1000000);
    await crowdsale.addValueBonus(ether(501), 1500000);
    await crowdsale.addValueBonus(ether(1000), 2000000);
    await crowdsale.setFoundersTokensWallet(wallets[0]);
    await crowdsale.setFoundersTokensPercent(1250000);
    await crowdsale.setAdvisorsTokensWallet(wallets[0]);
    await crowdsale.setAdvisorsTokensPercent(333000);
    await crowdsale.setBountyTokensWallet(wallets[0]);
    await crowdsale.setBountyTokensPercent(625000);
    await crowdsale.setLotteryTokensWallet(wallets[0]);
    await crowdsale.setLotteryTokensPercent(625);
    await crowdsale.transferOwnership(wallets[1]);
    await token.setSaleAgent(crowdsale.address);
    await token.transferOwnership(wallets[1]);
  });

  milestones.forEach((milestone, i) => {
    it(`should add ${milestone.bonus}% bonus for msg.value >= ${milestone.value} ETH`, async function () {
      await crowdsale.sendTransaction({value: ether(milestone.value), from: wallets[i]});
      const balance = await token.balanceOf(wallets[i]);
      const value = this.price.times(milestone.value).times(1 + milestone.bonus / 100);
      balance.should.be.bignumber.equal(value);
    });
  });
}
