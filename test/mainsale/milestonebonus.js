import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
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
    {day: 0, bonus: 48.2},
    {day: 7, bonus: 29.99},
    {day: 14, bonus: 14.01},
    {day: 21, bonus: 0}
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
    await crowdsale.addMilestone(7, 4820000);
    await crowdsale.addMilestone(7, 2999000);
    await crowdsale.addMilestone(7, 1401000);
    await crowdsale.addMilestone(9, 0);
    await crowdsale.addValueBonus(ether(2), 2000000);
    await crowdsale.addValueBonus(ether(11), 3000000);
    await crowdsale.addValueBonus(ether(51), 5000000);
    await crowdsale.addValueBonus(ether(101), 7000000);
    await crowdsale.addValueBonus(ether(301), 10000000);
    await crowdsale.addValueBonus(ether(501), 15000000);
    await crowdsale.addValueBonus(ether(1000), 20000000);
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
    it(`should add ${milestone.bonus}% bonus for milestone #${i}`, async function () {
      if (milestone.day !== 0) {
        await increaseTimeTo(this.start + duration.days(milestone.day));
      }
      await crowdsale.sendTransaction({value: ether(1), from: wallets[i]});
      const balance = await token.balanceOf(wallets[i]);
      const value = this.price.times(1 + milestone.bonus / 100);
      balance.should.be.bignumber.equal(value);
    });
  });
}
