import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

const should = require('chai')
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
    this.hardcap = ether(30000);
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

  it('crowdsale should be a saleAgent for token', async function () {
    const owner = await token.saleAgent();
    owner.should.equal(crowdsale.address);
  });

  it('end should be equal to start + duration', async function () {
    const start = await crowdsale.start();
    const end = await crowdsale.endSaleDate();
    end.should.bignumber.equal(start.plus(duration.days(this.duration)));
  });

  it('should reject payments before start', async function () {
    await crowdsale.setStart(this.start + duration.seconds(30), {from: wallets[1]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments after start', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.fulfilled;
  });

  it('should reject payments after end', async function () {
    await increaseTimeTo(this.afterEnd);
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should reject payments after finish', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.fulfilled;
    await crowdsale.finish({from: wallets[1]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should assign tokens to sender', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]});
    const balance = await token.balanceOf(wallets[3]);
    balance.should.be.bignumber.equal(this.price.times(1.482));
  });

  it('should forward funds to wallet', async function () {
    const pre = web3.eth.getBalance(wallets[2]);
    await crowdsale.sendTransaction({value: ether(1.23456), from: wallets[3]});
    const post = web3.eth.getBalance(wallets[2]);
    post.minus(pre).should.be.bignumber.equal(ether(1.23456));
  });
}
