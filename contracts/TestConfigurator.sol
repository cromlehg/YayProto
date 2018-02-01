pragma solidity ^0.4.18;

import 'localhost/ownership/Ownable.sol';

contract YayProtoToken {
   function setSaleAgent(address newSaleAgent) public;
   function transferOwnership(address newOwner) public;
    
}

contract Presale {
    function setMainsale(address newMainsale) public;
    function setSoftcap(uint newSoftcap) public;
    function setWallet(address newWallet) public;
    function setStart(uint newStart) public;
    function setHardcap(uint newHardcap) public;
    function addMilestone(uint period, uint bonus) public;
    function setDirectMintAgent(address newDirectMintAgent) public;
    function setMinPrice(uint newMinPrice) public;
    function setPrice(uint newPrice) public;
    function setToken(address newToken) public;
    function transferOwnership(address newOwner) public;    
}

contract Mainsale {
    function setMarketingTokensPercent(uint newMarketingTokensPercent) public;
    function setDevelopersTokensPercent(uint newDevelopersTokensPercent) public;
    function setAdvisorsTokensPercent(uint newAdvisorsTokensPercent) public;
    function setTeamTokensPercent(uint newTeamTokensPercent) public;
    function setMarketingTokensWallet(address newMarketingTokensWallet) public;
    function setDevelopersTokensWallet(address newDevelopersTokensWallet) public;
    function setAdvisorsTokensWallet(address newAdvisorsTokensWallet) public;
    function setTeamTokensWallet(address newTeamTokensWallet) public;
    function setWallet(address newWallet) public;
    function setStart(uint newStart) public;
    function setHardcap(uint newHardcap) public;
    function addMilestone(uint period, uint bonus) public;
    function setDirectMintAgent(address newDirectMintAgent) public;
    function setMinPrice(uint newMinPrice) public;
    function setPrice(uint newPrice) public;
    function setToken(address newToken) public;
    function transferOwnership(address newOwner) public;
    
}

contract TestConfigurator is Ownable {
    
    function deploy(address _token, address _presale, address _mainsale) public onlyOwner{
        YayProtoToken token = YayProtoToken(_token);
        Presale presale = Presale(_presale);
        Mainsale mainsale = Mainsale(_mainsale);
        
        presale.setPrice(7500);
        presale.setWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        presale.setStart(1517356800);
        presale.setMinPrice(100000000000000000);
        presale.setSoftcap(3000000000000000000000);
        presale.setHardcap(11250000000000000000000);
        presale.setMainsale(_mainsale);
        presale.addMilestone(7,60);
        presale.addMilestone(7,50);
        presale.addMilestone(7,40);
        presale.addMilestone(7,30);
        presale.addMilestone(7,25);
        presale.addMilestone(7,20);
        presale.setToken(_token);
        presale.transferOwnership(owner);
        
        mainsale.setPrice(7500);
        mainsale.setWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        mainsale.setDevelopersTokensWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        mainsale.setTeamTokensWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        mainsale.setMarketingTokensWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        mainsale.setAdvisorsTokensWallet(0x29b637Ca54Fc1A9d8d92475f8a64C199c91B82E4);
        mainsale.setStart(1523750400);
        mainsale.setMinPrice(100000000000000000);
        mainsale.setHardcap(95000000000000000000000);
        mainsale.setDevelopersTokensPercent(10);
        mainsale.setTeamTokensPercent(10);
        mainsale.setMarketingTokensPercent(5);
        mainsale.setAdvisorsTokensPercent(10);
        mainsale.addMilestone(7,15);
        mainsale.addMilestone(7,10);
        mainsale.addMilestone(7,7);
        mainsale.addMilestone(7,4);
        mainsale.addMilestone(7,0);
        mainsale.setToken(_token);
        mainsale.transferOwnership(owner);
        
        token.setSaleAgent(_presale);
        token.transferOwnership(owner);
        
    }
    
}
