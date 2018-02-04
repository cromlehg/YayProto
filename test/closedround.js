import valuebonus from './closedround/valuebonus';
import capped from './closedround/capped';
import common from './closedround/common';

const token = artifacts.require('REPUToken.sol');
const crowdsale = artifacts.require('ClosedRound.sol');

contract('ClosedRound - common test', function (accounts) {
  common(token, crowdsale, accounts);
});

contract('ClosedRound - capped crowdsale test', function (accounts) {
  capped(token, crowdsale, accounts);
});

contract('ClosedRound - value bonus test', function (accounts) {
  valuebonus(token, crowdsale, accounts);
});
