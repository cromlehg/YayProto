pragma solidity 0.4.18;

import './token/MintableToken.sol';

contract YayProtoToken is MintableToken {

  string public constant name = "YayProto";

  string public constant symbol = "YFN";

  uint32 public constant decimals = 18;

  address public saleAgent;

  modifier notLocked() {
    require(mintingFinished || msg.sender == owner || msg.sender == saleAgent);
    _;
  }

  function setSaleAgent(address newSaleAgent) public {
    require(msg.sender == owner || msg.sender == saleAgent);
    saleAgent = newSaleAgent;
  }

  function transfer(address _to, uint256 _value) public notLocked returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public notLocked returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

}
