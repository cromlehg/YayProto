pragma solidity ^0.4.19;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  uint256 public totalSupply;
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

}

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   *
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   *
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
    Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   *
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
    uint oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue > oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

contract RetrieveTokenFeature is Ownable {

  function retrieveTokens(address to, address anotherToken) public onlyOwner {
    ERC20 alienToken = ERC20(anotherToken);
    alienToken.transfer(to, alienToken.balanceOf(this));
  }

}


contract COFIToken is StandardToken, RetrieveTokenFeature {
    
  string public symbol = "COFI";
  
  string public name = "COFI";
  
  uint8 public decimals = 18;
  
  bool public locked = true;
  
  address public saleAgent = new TGE();
  
  modifier notLocked() {
    require(msg.sender == saleAgent || !locked);
    _;
  }
  
  function COFIToken() public {
    totalSupply =  300000000000000000000000000;
    balances[saleAgent] = totalSupply;
    TGE(saleAgent).setToken(this);
    TGE(saleAgent).transferOwnership(owner);
  }  
    
  function unlock() public {
    require(msg.sender == saleAgent || msg.sender == owner);
    locked = false;      
  }

  function transfer(address _to, uint256 _value) public notLocked returns (bool) {
    super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public notLocked returns (bool) {
    super.transferFrom(_from, _to, _value);
  }
  
}

contract FundationTokensWallet is Ownable {
    
  using SafeMath for uint256;
    
  COFIToken public token; 

  uint public start;
  
  uint public period = 2 years;
  
  uint public duration = 24 weeks;
  
  uint public started;
  
  uint public startBalance;

  function setToken(address newToken) public onlyOwner {
    token = COFIToken(newToken);
  }
  
  function start() public onlyOwner {
    started = now;
    startBalance = token.balanceOf(this);
  }
  
  function retrieveTokens(address to) public onlyOwner {
    if(now > started + period) {
      token.transfer(to, token.balanceOf(this));
    } else {
      uint cliffTokens = startBalance.div(period.div(duration));
      uint tokensToRetreive = now.sub(started).div(duration).mul(cliffTokens);
      token.transfer(to, tokensToRetreive);
    }
  }
  
}

contract TGE is RetrieveTokenFeature {
 
  using SafeMath for uint256;
    
  struct Milestone {
    uint start;
    uint end;
    uint bonus;
  }
  
  address public wallet;

  address public foundersTokensWallet;

  FundationTokensWallet public fundationTokensWallet = new FundationTokensWallet();
  
  uint public price = 7500;
  
  Milestone[] public milestones;
  
  COFIToken public token; 
  
  uint constant public PERCENT_RATE = 100;
  
  uint public tokensToSell = 150000000000000000000000000;
  
  uint public tokensToFounders = 90000000000000000000000000; 

  mapping (address => bool) whiteList;

  function TGE() public {
    addMilestone(1515974400,20,1516579200);
    addMilestone(1516579200,15,1517097600);
    addMilestone(1517184000,10,1517702400);
    addMilestone(1517702400,5,1517706000);
    addMilestone(1517706000,0,1519257600);
  }

  function setWallet(address newWallet) public onlyOwner {
    wallet = newWallet;  
  }
  
  function setToken(address newToken) public onlyOwner {
    token = COFIToken(newToken);  
    fundationTokensWallet.setToken(newToken);
  }

  function setTokensToFounders(address newFoundersTokensWallet) public onlyOwner {
    foundersTokensWallet = newFoundersTokensWallet;  
  }

  function setTokensToFounders(uint newTokensToSell) public onlyOwner {
    tokensToSell = newTokensToSell;  
  }
  
  function setTokensToSell(uint newTokensToSell) public onlyOwner {
    tokensToSell = newTokensToSell;  
  }
  
  function setPrice(uint newPrice) public onlyOwner {
    price = newPrice;  
  }
  
  function addMilestone(uint start, uint end, uint bonus) public onlyOwner {
    milestones.push(Milestone(start, end, bonus));  
  }
  
  function changeMilestone(uint i, uint start, uint end, uint bonus) public onlyOwner {
    require(i < milestones.length);
    milestones[i].start = start;
    milestones[i].end = end;
    milestones[i].bonus = bonus;
  }
  
  function getBonus() public view returns(uint) {
    for(uint i = 0; i < milestones.length; i++) {
      if(now >= milestones[i].start && now < milestones[i].end)
        return milestones[i].bonus;
    }
    revert();
  }
  
  function calculateTokens(uint amountInWei) public view returns(uint) {
    uint tokens = amountInWei.mul(price);
    uint bonus = getBonus();
    if(bonus > 0) 
      tokens = tokens.mul(bonus).div(PERCENT_RATE);
    return tokens; 
  }
  
  function directTransfer(address to, uint amountTokensInDouble) public onlyOwner returns(uint) {
    if(amountTokensInDouble > tokensToSell) {
      amountTokensInDouble = amountTokensInDouble.sub(tokensToSell);
    }
    tokensToSell = tokensToSell.sub(amountTokensInDouble);
    token.transfer(to, amountTokensInDouble);
    return amountTokensInDouble; 
  }
  
  function directTransferByETH(address to, uint amountInWei) public onlyOwner returns(uint) {
    uint calculatedTokens = calculateTokens(amountInWei); 
    uint transferredTokens = directTransfer(to, calculatedTokens);
    if(transferredTokens < calculatedTokens) {
      uint bonus = getBonus();
      if(bonus > 0) {
        transferredTokens = transferredTokens.mul(PERCENT_RATE).div(bonus); 
      }
      amountInWei = transferredTokens.div(price);
    }
    return amountInWei;
  }

  function isContract(address _addr) private view returns (bool is_contract) {
    uint length;
    assembly {
      //retrieve the size of the code on target address, this needs assembly
      length := extcodesize(_addr)
    }
    return (length>0);
  }
  
  function addToWhiteList(address addr) public {
    whiteList[addr] = true;
  }
  
  function () external payable {
    require(whiteList[msg.sender]);
    uint actual = directTransferByETH(msg.sender, msg.value);
    wallet.transfer(actual);
    if(actual < msg.value) {
      require(isContract(msg.sender));
      // check msg.sender not code to prevent re-entrance attack
      msg.sender.transfer(msg.value.sub(actual));
    }
  }
  
  function finish() public {
    token.transfer(foundersTokensWallet, tokensToFounders);    
    token.transfer(fundationTokensWallet, token.balanceOf(this));
    token.unlock();
    fundationTokensWallet.start();
    fundationTokensWallet.transferOwnership(owner);
  }
  
}


