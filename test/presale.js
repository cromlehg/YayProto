import capped from './presale/capped';
import common from './presale/common';
import milestonebonus from './presale/milestonebonus';
import totalbonus from './presale/totalbonus';
import valuebonus from './presale/valuebonus';

const token = artifacts.require('REPUToken.sol');
const crowdsale = artifacts.require('Presale.sol');

contract('Presale - common test', function (accounts) {
  common(token, crowdsale, accounts);
});

contract('Presale - capped crowdsale test', function (accounts) {
  capped(token, crowdsale, accounts);
});

contract('Presale - value bonus test', function (accounts) {
  valuebonus(token, crowdsale, accounts);
});

contract('Presale - milestone bonus test', function (accounts) {
  milestonebonus(token, crowdsale, accounts);
});

contract('Presale - total bonus test', function (accounts) {
  totalbonus(token, crowdsale, accounts);
});
