pragma solidity ^0.4.18;

import './SoftcapFeature.sol';
import './CommonSale.sol';
import './Mainsale.sol';

contract Presale is SoftcapFeature, CommonSale {

  Mainsale public mainsale;

  function setMainsale(address newMainsale) public onlyOwner {
    mainsale = Mainsale(newMainsale);
  }

  function finish() public onlyOwner {
    token.setSaleAgent(mainsale);
  }

  function mintTokens(address to, uint weiInvested) internal {
    super.mintTokens(to, weiInvested);
    updateBalance(msg.sender, msg.value);
  }

  function () external payable minPriceLimit {
    mintTokens(msg.sender, msg.value);
  }

  function refund() public {
    require(refundOn && balances[msg.sender] > 0);
    uint value = balances[msg.sender];
    balances[msg.sender] = 0;
    msg.sender.transfer(value);
  }

  function finishMinting() public onlyOwner {
    if (updateRefundState()) {
      token.finishMinting();
    } else {
      withdraw();
      token.setSaleAgent(mainsale);
    }
  }

}
