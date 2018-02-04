pragma solidity ^0.4.18;

import './ownership/Ownable.sol';

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

    YayProtoToken public token;
    Presale public presale;
    Mainsale public mainsale;

    function setToken(address _token) public onlyOwner {
      token = YayProtoToken(_token);
    }

    function setPresale(address _presale) public onlyOwner {
      presale = Presale(_presale);
    }

    function setMainsale(address _mainsale) public onlyOwner {
      mainsale = Mainsale(_mainsale);
    }

    function deploy() public onlyOwner {

        presale.setToken(token);
        presale.setWallet(0x00c286bFbEfa2e7D060259822EDceA2E922a2B7C);
        presale.setStart(1517356800);
        presale.setMinPrice(100000000000000000);
        presale.setPrice(7500000000000000000000);
        presale.setSoftcap(3000000000000000000);
        presale.setHardcap(6000000000000000000);
        presale.addMilestone(7,60);
        presale.addMilestone(7,50);
        presale.addMilestone(7,40);
        presale.addMilestone(7,30);
        presale.addMilestone(7,25);
        presale.addMilestone(7,20);
        presale.setMainsale(mainsale);

        mainsale.setToken(token);
        mainsale.setPrice(7500000000000000000000);
        mainsale.setWallet(0x009693f53723315219f681529fE6e05a91a28C41);
        mainsale.setDevelopersTokensWallet(0x0097895f899559D067016a3d61e3742c0da533ED);
        mainsale.setTeamTokensWallet(0x00137668FEda9d278A242C69aB520466A348C954);
        mainsale.setMarketingTokensWallet(0x00A8a63f43ce630dbd3b96F1e040A730341bAa4D);
        mainsale.setAdvisorsTokensWallet(0x00764817d154237115DdA4FAA76C7aaB5dE3cb25);
        mainsale.setStart(1523750400);
        mainsale.setMinPrice(100000000000000000);
        mainsale.setHardcap(6000000000000000000);
        mainsale.setDevelopersTokensPercent(10);
        mainsale.setTeamTokensPercent(10);
        mainsale.setMarketingTokensPercent(5);
        mainsale.setAdvisorsTokensPercent(10);
        mainsale.addMilestone(7,15);
        mainsale.addMilestone(7,10);
        mainsale.addMilestone(7,7);
        mainsale.addMilestone(7,4);
        mainsale.addMilestone(7,0);

        token.setSaleAgent(presale);

        token.transferOwnership(owner);
        presale.transferOwnership(owner);
        mainsale.transferOwnership(owner);

    }

}
