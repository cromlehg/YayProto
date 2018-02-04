import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

export default function (Token, Crowdsale, wallets) {
  let token;
  let crowdsale;
  const milestones = [
    {day: 0, bonus: 60},
    {day: 7, bonus: 50},
    {day: 14, bonus: 40},
    {day: 21, bonus: 30},
    {day: 28, bonus: 25},
    {day: 35, bonus: 20}
  ];

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime();
    this.duration = 42;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(7500);
    this.softcap = ether(3000);
    this.hardcap = ether(11250);
    this.minInvestmentLimit = ether(0.1);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setMinPrice(this.minInvestmentLimit);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.addMilestone(7, 60);
    await crowdsale.addMilestone(7, 50);
    await crowdsale.addMilestone(7, 40);
    await crowdsale.addMilestone(7, 30);
    await crowdsale.addMilestone(7, 25);
    await crowdsale.addMilestone(7, 20);
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
