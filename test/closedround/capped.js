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
    this.price = tokens(12500);
    this.hardcap = ether(50);
    this.minInvestmentLimit = ether(1);
    this.maxInvestmentLimit = ether(98);

    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await crowdsale.setPrice(this.price);
    await crowdsale.setMinInvestedLimit(this.minInvestmentLimit);
    await crowdsale.setMaxLimit(this.maxInvestmentLimit);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setStart(this.start);
    await crowdsale.setEnd(this.end);
    await crowdsale.setWallet(wallets[2]);
    await crowdsale.setToken(token.address);
    await crowdsale.addValueBonus(ether(2), 2);
    await crowdsale.addValueBonus(ether(11), 5);
    await crowdsale.addValueBonus(ether(51), 7);
    await crowdsale.addValueBonus(ether(101), 10);
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
    const value = this.minInvestmentLimit.minus(ether(0.1));
    await crowdsale.sendTransaction({value: value, from: wallets[5]}).should.be.rejectedWith(EVMRevert);
  });

  it('should reject payments above max investment limit', async function () {
    const value = this.maxInvestmentLimit.plus(ether(0.1));
    await crowdsale.sendTransaction({value: value, from: wallets[7]}).should.be.rejectedWith(EVMRevert);
  });
}
