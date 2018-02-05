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

  it('contracts should have token address', async function () {
    const tokenOwner = await token.owner();
    await console.log(tokenOwner);
  });
});
