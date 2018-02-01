pragma solidity ^0.4.18;

import './CommonSale.sol';

contract Mainsale is CommonSale {

  address public marketingTokensWallet;

  address public developersTokensWallet;

  address public advisorsTokensWallet;

  address public teamTokensWallet;

  uint public marketingTokensPercent;

  uint public developersTokensPercent;

  uint public advisorsTokensPercent;

  uint public teamTokensPercent;

  function setMarketingTokensPercent(uint newMarketingTokensPercent) public onlyOwner {
    marketingTokensPercent = newMarketingTokensPercent;
  }

  function setDevelopersTokensPercent(uint newDevelopersTokensPercent) public onlyOwner {
    developersTokensPercent = newDevelopersTokensPercent;
  }

  function setAdvisorsTokensPercent(uint newAdvisorsTokensPercent) public onlyOwner {
    advisorsTokensPercent = newAdvisorsTokensPercent;
  }

  function setTeamTokensPercent(uint newTeamTokensPercent) public onlyOwner {
    teamTokensPercent = newTeamTokensPercent;
  }

  function setMarketingTokensWallet(address newMarketingTokensWallet) public onlyOwner {
    marketingTokensWallet = newMarketingTokensWallet;
  }

  function setDevelopersTokensWallet(address newDevelopersTokensWallet) public onlyOwner {
    developersTokensWallet = newDevelopersTokensWallet;
  }

  function setAdvisorsTokensWallet(address newAdvisorsTokensWallet) public onlyOwner {
    advisorsTokensWallet = newAdvisorsTokensWallet;
  }

  function setTeamTokensWallet(address newTeamTokensWallet) public onlyOwner {
    teamTokensWallet = newTeamTokensWallet;
  }

  function finish() public onlyOwner {
    uint extendedTokensPercent = marketingTokensPercent.add(teamTokensPercent).add(developersTokensPercent).add(advisorsTokensPercent);
    uint allTokens = token.totalSupply().mul(percentRate).div(percentRate.sub(extendedTokensPercent));
    createAndTransferTokens(marketingTokensWallet,allTokens.mul(marketingTokensPercent).div(percentRate));
    createAndTransferTokens(teamTokensWallet,allTokens.mul(teamTokensPercent).div(percentRate));
    createAndTransferTokens(developersTokensWallet,allTokens.mul(developersTokensPercent).div(percentRate));
    createAndTransferTokens(advisorsTokensWallet,allTokens.mul(advisorsTokensPercent).div(percentRate));
    token.finishMinting();
  }

  function () external payable minPriceLimit {
    wallet.transfer(msg.value);
    mintTokens(msg.sender, msg.value);
  }

}
