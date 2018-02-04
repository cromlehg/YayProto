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
    await crowdsale.setPercentRate(100000);
    await crowdsale.addMilestone(7, 48200);
    await crowdsale.addMilestone(7, 29990);
    await crowdsale.addMilestone(7, 14010);
    await crowdsale.addMilestone(9, 0);
    await crowdsale.addValueBonus(ether(2), 20000);
    await crowdsale.addValueBonus(ether(11), 30000);
    await crowdsale.addValueBonus(ether(51), 50000);
    await crowdsale.addValueBonus(ether(101), 70000);
    await crowdsale.addValueBonus(ether(301), 100000);
    await crowdsale.addValueBonus(ether(501), 150000);
    await crowdsale.addValueBonus(ether(1000), 200000);
    await crowdsale.setFoundersTokensWallet(wallets[3]);
    await crowdsale.setFoundersTokensPercent(12500);
    await crowdsale.setAdvisorsTokensWallet(wallets[4]);
    await crowdsale.setAdvisorsTokensPercent(3330);
    await crowdsale.setBountyTokensWallet(wallets[5]);
    await crowdsale.setBountyTokensPercent(6250);
    await crowdsale.setLotteryTokensWallet(wallets[6]);
    await crowdsale.setLotteryTokensPercent(625);
    await crowdsale.transferOwnership(wallets[1]);
    await token.setSaleAgent(crowdsale.address);
    await token.transferOwnership(wallets[1]);
  });

  it('should correctly calculate bonuses for founders, advisors, etc.', async function () {
    await crowdsale.sendTransaction({value: ether(0.03), from: wallets[0]});
    await crowdsale.sendTransaction({value: ether(99), from: wallets[2]});
    await crowdsale.finish({from: wallets[1]});
    const firstInvestorTokens = await token.balanceOf(wallets[0]);
    const secondInvestorTokens = await token.balanceOf(wallets[2]);
    const foundersTokens = await token.balanceOf(wallets[3]);
    const advisorsTokens = await token.balanceOf(wallets[4]);
    const bountyTokens = await token.balanceOf(wallets[5]);
    const lotteryTokens = await token.balanceOf(wallets[6]);
    const totalTokens = firstInvestorTokens
      .plus(secondInvestorTokens)
      .plus(foundersTokens)
      .plus(advisorsTokens)
      .plus(bountyTokens)
      .plus(lotteryTokens);
    assert.equal(foundersTokens.div(totalTokens), 0.125);
    assert.equal(advisorsTokens.div(totalTokens), 0.0333);
    assert.equal(bountyTokens.div(totalTokens), 0.0625);
    assert.equal(lotteryTokens.div(totalTokens), 0.00625);
  });
}
