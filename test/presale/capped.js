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
    this.duration = 42;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
    this.price = tokens(7500);
    this.softcap = ether(3000);
    this.hardcap = ether(11);
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

  it('should accept payments within hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap.minus(ether(1)), from: wallets[3]}).should.be.fulfilled;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.fulfilled;
  });

  it('should reject payments outside hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap, from: wallets[5]}).should.be.fulfilled;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.rejectedWith(EVMRevert);
  });

  it('should not accept payments that exceed hardcap', async function () {
    await crowdsale.sendTransaction({value: this.hardcap.plus(1), from: wallets[6]}).should.be.rejectedWith(EVMRevert);
  });

  it('should reject payments below min investment limit', async function () {
    const value = this.minInvestmentLimit.minus(ether(0.01));
    await crowdsale.sendTransaction({value: value, from: wallets[5]}).should.be.rejectedWith(EVMRevert);
  });
}
