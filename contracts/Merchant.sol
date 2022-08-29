pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Merchant is ERC20Upgradeable {
    struct Allowance {
        uint allowanceAmount;
        uint allowancePeriodInDays;
        uint whenLastAllowance;
        uint unspentAllowance;
    }
    __ERC20_init _asset = 0xC6d1eFd908ef6B69dA0749600F553923C465c812;

    Allowance allowances;

    function getPaidAllowance(uint amount) public onlyVault {
        // Calculate and update unspent allowance
        uint numAllowances = (block.timestamp - allowances.whenLastAllowance) /
            (allowances.allowancePeriodInDays);

        allowances.unspentAllowance =
            (allowances.allowanceAmount * numAllowances) +
            (allowances.unspentAllowance);

        allowances.whenLastAllowance =
            (numAllowances * (1 days)) +
            (allowances.whenLastAllowance);

        // Pay allowance
        require(
            allowances.unspentAllowance >= amount,
            "You asked for more allowance than you're owed'"
        );
        payable(msg.sender).transfer(amount); // Mudar pra ERC20 transferFrom
        _asset.safeTransfer(
            0xC6d1eFd908ef6B69dA0749600F553923C465c812,
            0xed578BAd241455C0d57419659a3a6Eb9c770cC8d,
            10
        );
        allowances.unspentAllowance = allowances.unspentAllowance - (amount);
    }

    modifier onlyVault() {
        require(msg.sender == 0xed578BAd241455C0d57419659a3a6Eb9c770cC8d);
        _;
    }
}
