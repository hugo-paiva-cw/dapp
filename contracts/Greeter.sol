// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// import "hardhat/console.sol";

// contract Greeter {
//     string private greeting;

//     constructor(string memory _greeting) {
//         console.log("Deploying a Greeter with greeting:", _greeting);
//         greeting = _greeting;
//     }

//     function greet() public view returns (string memory) {
//         return greeting;
//     }

//     function setGreeting(string memory _greeting) public {
//         console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
//         greeting = _greeting;
//     }
// }

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";

contract Greeter is ERC4626Upgradeable {
    function initialize(
        ERC20BurnableUpgradeable asset_,
        string memory name_,
        string memory symbol_
    ) public initializer {
        // __ERC20_init_unchained(name_, symbol_);
        __ERC4626_init(asset_);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
