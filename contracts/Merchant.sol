pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./ABDKMath64x64.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract Merchant {
    ERC20Upgradeable public token;
    address public owner;
    address vaultAddres;
    uint public dailyCDIinPoints = 35061; // CDI atual de 13,65 em base de 356 dias // fracao de 1% por 1_000_000;
    uint public whenLastFunding = 1661828400; // timestamp de meia noite

    function initialize(ERC20Upgradeable _token) public {
        token = ERC20Upgradeable(_token); // 0xC6d1eFd908ef6B69dA0749600F553923C465c812
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyVault() {
        require(msg.sender == vaultAddres, "You are not the Vault");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setDailyCDIinPoints(uint _points) public onlyOwner {
        dailyCDIinPoints = _points;
    }

    function setVaultAddres(address _vaultAddress) public onlyOwner {
        vaultAddres = _vaultAddress;
    }

    function getPaidFunding(uint _totalAssets) external onlyVault {
        uint numFundings = (block.timestamp - whenLastFunding) / (1 days);

        int128 interest = getInterestSince(numFundings);
        int128 amountOfMoney = ABDKMath64x64.fromUInt(_totalAssets);
        uint justTheInterests = ABDKMath64x64.toUInt(
            ABDKMath64x64.mul(interest, amountOfMoney)
        );

        whenLastFunding = (numFundings * (1 days)) + whenLastFunding;
        if (justTheInterests > 0) token.transfer(vaultAddres, justTheInterests);
    }

    function getInterestSince(uint periodElapsed)
        internal
        view
        returns (int128)
    {
        // Get interest ratio in binary that in the end converts to 1.05 for example meaning an addition of 5%
        int128 acumulattedInterestInBinary = ABDKMath64x64.sub(
            ABDKMath64x64.pow(
                ABDKMath64x64.add(
                    ABDKMath64x64.fromUInt(1),
                    ABDKMath64x64.div(
                        ABDKMath64x64.fromUInt(dailyCDIinPoints),
                        ABDKMath64x64.fromUInt(100000000) // 100 do percentual vezes 1_000_000 da fraçao do daily points
                    )
                ),
                periodElapsed
            ),
            ABDKMath64x64.fromUInt(1)
        );

        return acumulattedInterestInBinary;
    }

    function withdraw(uint amount) public onlyOwner {
        token.transfer(owner, amount);
    }

    function totalAssets() public view returns (uint) {
        return token.balanceOf(address(this));
    }
}
