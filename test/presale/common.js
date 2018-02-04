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

  it('crowdsale should be a saleAgent for token', async function () {
    const owner = await token.saleAgent();
    owner.should.equal(crowdsale.address);
  });

  it('end should be equal to start + duration', async function () {
    const start = await crowdsale.start();
    const end = await crowdsale.lastSaleDate();
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
    balance.should.be.bignumber.equal(this.price.times(1.6));
  });
}
