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

export default function (Token, Crowdsale, DevWallet, wallets) {
  let token;
  let crowdsale;
  let devWallet;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime() + duration.weeks(1);
    this.duration = 1;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(3937.0078);
    this.hardcap = ether(30);
    this.minInvestmentLimit = ether(0.03);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    devWallet = await DevWallet.new();
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
    await crowdsale.setDevWallet(devWallet.address);
    await crowdsale.transferOwnership(wallets[1]);
    await token.setSaleAgent(crowdsale.address);
    await token.transferOwnership(wallets[1]);

    await increaseTimeTo(this.start);
  });

  it('should forward funds to devWallet', async function () {
    const pre = web3.eth.getBalance(devWallet.address);
    await crowdsale.sendTransaction({value: ether(1.23456), from: wallets[3]});
    const post = web3.eth.getBalance(devWallet.address);
    post.minus(pre).should.be.bignumber.equal(ether(1.23456));
  });

  it('should not forward funds above devLimit', async function () {
    const pre = web3.eth.getBalance(devWallet.address);
    await crowdsale.sendTransaction({value: ether(1.23456), from: wallets[3]});
    await crowdsale.sendTransaction({value: ether(2.34567), from: wallets[3]});
    await crowdsale.sendTransaction({value: ether(3.45678), from: wallets[3]});
    const post = web3.eth.getBalance(devWallet.address);
    post.minus(pre).should.be.bignumber.equal(ether(4.5));
  });

  it('should not forward funds above devLimit', async function () {
    const pre = web3.eth.getBalance(devWallet.address);
    await crowdsale.sendTransaction({value: ether(5), from: wallets[3]});
    const post = web3.eth.getBalance(devWallet.address);
    post.minus(pre).should.be.bignumber.equal(ether(4.5));
  });

  it('should forward all remaining funds to wallet', async function () {
    const pre = web3.eth.getBalance(wallets[2]);
    await crowdsale.sendTransaction({value: ether(1.23456), from: wallets[3]});
    await crowdsale.sendTransaction({value: ether(2.34567), from: wallets[3]});
    await crowdsale.sendTransaction({value: ether(3.45678), from: wallets[3]});
    const post = web3.eth.getBalance(wallets[2]);
    const sum = ether(1.23456).plus(ether(2.34567)).plus(ether(3.45678));
    post.minus(pre).should.be.bignumber.equal(sum.minus(ether(4.5)));
  });

  it('should reject to withdraw funds from devWallet before sales end', async function () {
    await devWallet.withdraw().should.be.rejectedWith(EVMRevert);
  });

  it('should allow to withdraw funds from devWallet after sales end', async function () {
    await crowdsale.sendTransaction({value: ether(5), from: wallets[3]});
    await increaseTimeTo(1525255200);
    await devWallet.withdraw().should.be.fulfilled;
    const balance = web3.eth.getBalance('0xEA15Adb66DC92a4BbCcC8Bf32fd25E2e86a2A770');
    balance.should.be.bignumber.equal(ether(4.5));
  });
}
