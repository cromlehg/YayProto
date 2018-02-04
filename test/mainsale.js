import bounty from './mainsale/bounty';
import capped from './mainsale/capped';
import common from './mainsale/common';
import devwallet from './mainsale/devwallet';
import milestonebonus from './mainsale/milestonebonus';
import totalbonus from './mainsale/totalbonus';
import valuebonus from './mainsale/valuebonus';

const token = artifacts.require('REPUToken.sol');
const crowdsale = artifacts.require('Mainsale.sol');
const DevWallet = artifacts.require('DevWallet.sol');

contract('Mainsale - common test', function (accounts) {
  common(token, crowdsale, accounts);
});

contract('Mainsale - capped crowdsale test', function (accounts) {
  capped(token, crowdsale, accounts);
});

contract('Mainsale - value bonus test', function (accounts) {
  valuebonus(token, crowdsale, accounts);
});

contract('Mainsale - milestone bonus test', function (accounts) {
  milestonebonus(token, crowdsale, accounts);
});

contract('Mainsale - total bonus test', function (accounts) {
  totalbonus(token, crowdsale, accounts);
});

contract('Mainsale - bounty test', function (accounts) {
  bounty(token, crowdsale, accounts);
});

contract('Mainsale - devWallet test', function (accounts) {
  devwallet(token, crowdsale, DevWallet, accounts);
});
