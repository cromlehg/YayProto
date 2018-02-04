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

  it('should accept payments within hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap.minus(1), from: wallets[3]}).should.be.fulfilled;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.fulfilled;
  });

  it('should reject payments outside hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap, from: wallets[5]}).should.be.fulfilled;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments that exceed hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap.plus(1), from: wallets[6]}).should.be.fulfilled;
  });

  it('should reject payments below min investment limit', async function () {
    const value = this.minInvestmentLimit.minus(ether(0.01));
    await crowdsale.sendTransaction({value: value, from: wallets[5]}).should.be.rejectedWith(EVMRevert);
  });
}
