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
    {value: 11, bonus: 5},
    {value: 51, bonus: 7},
    {value: 98, bonus: 10}
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
    this.price = tokens(12500);
    this.hardcap = ether(50);
    this.minInvestmentLimit = ether(1);
    this.maxInvestmentLimit = ether(250);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setMinInvestedLimit(this.minInvestmentLimit);
    await crowdsale.setMaxLimit(ether(this.maxInvestmentLimit));
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setEnd(this.end);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.addValueBonus(ether(2), 2);
    await crowdsale.addValueBonus(ether(11), 5);
    await crowdsale.addValueBonus(ether(51), 7);
    await crowdsale.addValueBonus(ether(98), 10);
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
