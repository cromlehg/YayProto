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
    {day: 0, bonus: 21.59},
    {day: 1, bonus: 15.8},
    {day: 2, bonus: 10.28},
    {day: 3, bonus: 5.04},
    {day: 4, bonus: 0}
  ];

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime();
    this.duration = 7;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(6854.00959);
    this.hardcap = ether(1800);
    this.minInvestmentLimit = ether(0.1);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setMinInvestedLimit(this.minInvestmentLimit);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.setPercentRate(10000);
    await crowdsale.addMilestone(1, 2159);
    await crowdsale.addMilestone(1, 1580);
    await crowdsale.addMilestone(1, 1028);
    await crowdsale.addMilestone(1, 504);
    await crowdsale.addMilestone(3, 0);
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
      const value = this.price.times(1).times(1 + milestone.bonus / 100);
      balance.should.be.bignumber.equal(value);
    });
  });
}
