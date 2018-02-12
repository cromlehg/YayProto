import ether from './helpers/ether';
import tokens from './helpers/tokens';
import {advanceBlock} from './helpers/advanceToBlock';
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

const Configurator = artifacts.require('Configurator.sol');
const Token = artifacts.require('YayProtoToken.sol');
const Presale = artifacts.require('Presale.sol');
const Mainsale = artifacts.require('Mainsale.sol');

contract('Configurator integration test', function (accounts) {
  let configurator;
  let token;
  let presale;
  let mainsale;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
    configurator = await Configurator.new();
    await configurator.deploy();
    const tokenAddress = await configurator.token();
    const presaleAddress = await configurator.presale();
    const mainsaleAddress = await configurator.mainsale();
    token = await Token.at(tokenAddress);
    presale = await Presale.at(presaleAddress);
    mainsale = await Mainsale.at(mainsaleAddress);
  });

  it('contracts should have an owner', async function () {
    const tokenOwner = await token.owner();
    tokenOwner.should.equal(accounts[0]);
    const presaleOwner = await presale.owner();
    presaleOwner.should.equal(accounts[0]);
    const mainsaleOwner = await mainsale.owner();
    mainsaleOwner.should.equal(accounts[0]);
  });

  it('presale and mainsale should have start time as described in README', async function () {
    const presaleStart = await presale.start();
    presaleStart.should.bignumber.equal((new Date('12 February 2018 13:00:00 GMT')).getTime() / 1000);
    const mainsaleStart = await mainsale.start();
    mainsaleStart.should.bignumber.equal((new Date('23 April 2018 13:00:00 GMT')).getTime() / 1000);
  });

  it('presale and mainsale should have prices as described in README', async function () {
    const presalePrice = await presale.price();
    presalePrice.should.bignumber.equal(tokens(7500));
    const mainsalePrice = await mainsale.price();
    mainsalePrice.should.bignumber.equal(tokens(7500));
  });

  it('presale and mainsale should have hardcaps as described in README', async function () {
    const presaleHardcap = await presale.hardCap();
    presaleHardcap.should.bignumber.equal(ether(1700));
    const mainsaleHardcap = await mainsale.hardCap();
    mainsaleHardcap.should.bignumber.equal(ether(46000));
  });

  it('presale and mainsale should have minimal insvested limit as described in README', async function () {
    const presaleMinInvest = await presale.minPrice();
    presaleMinInvest.should.bignumber.equal(ether(0.1));
    const mainsaleMinInvest = await mainsale.minPrice();
    mainsaleMinInvest.should.bignumber.equal(ether(0.1));
  });

  it('presale and mainsale should have wallets as described in README', async function () {
    const presaleWallet = await presale.wallet();
    presaleWallet.should.bignumber.equal('0x00c286bFbEfa2e7D060259822EDceA2E922a2B7C');
    const mainsaleWallet = await mainsale.wallet();
    mainsaleWallet.should.bignumber.equal('0x009693f53723315219f681529fE6e05a91a28C41');
  });

  it('Additional wallets should be the same as in README', async function () {
    const developersWallet = await mainsale.developersTokensWallet();
    developersWallet.should.bignumber.equal('0x0097895f899559D067016a3d61e3742c0da533ED');
    const teamWallet = await mainsale.teamTokensWallet();
    teamWallet.should.bignumber.equal('0x00137668FEda9d278A242C69aB520466A348C954');
    const marketingWallet = await mainsale.marketingTokensWallet();
    marketingWallet.should.bignumber.equal('0x00A8a63f43ce630dbd3b96F1e040A730341bAa4D');
    const advisorsWallet = await mainsale.advisorsTokensWallet();
    advisorsWallet.should.bignumber.equal('0x00764817d154237115DdA4FAA76C7aaB5dE3cb25');
  });
});
