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
    this.duration = 35;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(7500);
    this.softcap = ether(3000);
    this.hardcap = ether(95000);
    this.minInvestmentLimit = ether(0.1);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setMinPrice(this.minInvestmentLimit);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.addMilestone(7, 15);
    await crowdsale.addMilestone(7, 10);
    await crowdsale.addMilestone(7, 7);
    await crowdsale.addMilestone(7, 4);
    await crowdsale.addMilestone(7, 0);
    await crowdsale.setTeamTokensWallet(wallets[3]);
    await crowdsale.setTeamTokensPercent(10);
    await crowdsale.setDevelopersTokensWallet(wallets[4]);
    await crowdsale.setDevelopersTokensPercent(10);
    await crowdsale.setAdvisorsTokensWallet(wallets[5]);
    await crowdsale.setAdvisorsTokensPercent(10);
    await crowdsale.setMarketingTokensWallet(wallets[6]);
    await crowdsale.setMarketingTokensPercent(5);
    await crowdsale.transferOwnership(wallets[1]);
    await token.setSaleAgent(crowdsale.address);
    await token.transferOwnership(wallets[1]);
  });

  it('should correctly calculate bonuses for founders, advisors, etc.', async function () {
    await crowdsale.sendTransaction({value: ether(0.1), from: wallets[0]});
    await crowdsale.sendTransaction({value: ether(99), from: wallets[2]});
    await crowdsale.finish({from: wallets[1]});
    const firstInvestorTokens = await token.balanceOf(wallets[0]);
    const secondInvestorTokens = await token.balanceOf(wallets[2]);
    const teamTokens = await token.balanceOf(wallets[3]);
    const developersTokens = await token.balanceOf(wallets[4]);
    const advisorsTokens = await token.balanceOf(wallets[5]);
    const marketingTokens = await token.balanceOf(wallets[6]);
    const totalTokens = firstInvestorTokens
      .plus(secondInvestorTokens)
      .plus(teamTokens)
      .plus(developersTokens)
      .plus(advisorsTokens)
      .plus(marketingTokens);
    assert.equal(teamTokens.div(totalTokens), 0.1);
    assert.equal(developersTokens.div(totalTokens), 0.1);
    assert.equal(advisorsTokens.div(totalTokens), 0.1);
    assert.equal(marketingTokens.div(totalTokens), 0.05);
  });
}
