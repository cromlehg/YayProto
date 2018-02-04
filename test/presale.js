import additional from './presale/additional';
import capped from './presale/capped';
import common from './presale/common';
import milestonebonus from './presale/milestonebonus';
import refundable from './presale/refundable';

const token = artifacts.require('YayProtoToken.sol');
const crowdsale = artifacts.require('Presale.sol');

contract('Presale - common crowdsale test', function (accounts) {
  common(token, crowdsale, accounts);
});

contract('Presale - capped crowdsale test', function (accounts) {
  capped(token, crowdsale, accounts);
});

contract('Presale - refundable crowdsale test', function (accounts) {
  refundable(token, crowdsale, accounts);
});

contract('Presale - milestone bonus test', function (accounts) {
  milestonebonus(token, crowdsale, accounts);
});

contract('Presale - additional features test', function (accounts) {
  additional(token, crowdsale, accounts);
});
