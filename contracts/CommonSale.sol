pragma solidity 0.4.18;

import './StagedCrowdsale.sol';
import './WalletProvider.sol';
import './YayProtoToken.sol';

contract CommonSale is StagedCrowdsale, WalletProvider {

  address public directMintAgent;

  uint public percentRate = 100;

  uint public minPrice;

  uint public price;

  YayProtoToken public token;

  modifier onlyDirectMintAgentOrOwner() {
    require(directMintAgent == msg.sender || owner == msg.sender);
    _;
  }

  modifier minPriceLimit() {
    require(msg.value >= minPrice);
    _;
  }

  function setDirectMintAgent(address newDirectMintAgent) public onlyOwner {
    directMintAgent = newDirectMintAgent;
  }

  function setMinPrice(uint newMinPrice) public onlyOwner {
    minPrice = newMinPrice;
  }

  function setPrice(uint newPrice) public onlyOwner {
    price = newPrice;
  }

  function setToken(address newToken) public onlyOwner {
    token = YayProtoToken(newToken);
  }

  function directMint(address to, uint investedWei) public onlyDirectMintAgentOrOwner saleIsOn {
    mintTokens(to, investedWei);
  }

  function mintTokens(address to, uint weiInvested) internal {
    uint milestoneIndex = currentMilestone();
    Milestone storage milestone = milestones[milestoneIndex];
    invested = invested.add(msg.value);
    uint tokens = weiInvested.mul(1 ether).div(price);
    uint bonusTokens = tokens.mul(milestone.bonus).div(percentRate);
    uint tokensWithBonus = tokens.add(bonusTokens);
    createAndTransferTokens(to, tokensWithBonus);
  }

  function createAndTransferTokens(address to, uint tokens) public onlyDirectMintAgentOrOwner isUnderHardCap {
    token.mint(this, tokens);
    token.transfer(to, tokens);
  }

}
