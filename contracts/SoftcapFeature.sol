pragma solidity 0.4.18;

import './WalletProvider.sol';
import './math/SafeMath.sol';

contract SoftcapFeature is WalletProvider {

  using SafeMath for uint;

  mapping(address => uint) balances;

  bool public softcapAchieved;

  bool public refundOn;

  uint public softcap;

  uint public invested;

  function setSoftcap(uint newSoftcap) public onlyOwner {
    softcap = newSoftcap;
  }

  function withdraw() public onlyOwner {
    require(softcapAchieved);
    wallet.transfer(this.balance);
  }

  function updateBalance(address to, uint amount) internal {
    balances[to] = balances[to].add(amount);
    invested = invested.add(amount);
    if (!softcapAchieved && invested >= softcap) {
      softcapAchieved = true;
    }
  }

  function updateRefundState() internal returns(bool) {
    if (!softcapAchieved) {
      refundOn = true;
    }
    return refundOn;
  }

}
