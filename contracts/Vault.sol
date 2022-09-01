pragma solidity ^0.8;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";

interface IFunder {
    function getPaidFunding(uint) external;
}

contract Vault is ERC4626Upgradeable {
    function initialize(ERC20BurnableUpgradeable asset_) public initializer {
        // brlcAddress = IERC20Upgradeable(asset_);
        __ERC4626_init(asset_);
    }

    address public theOwner;
    address public brlcAddress;
    address funderAddr;

    constructor() {
        theOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == theOwner, "Not owner");
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function getMyBalance(address owner) public virtual returns (uint256) {
        checkForUpdatedFunds();
        return
            _convertToAssets(balanceOf(owner), MathUpgradeable.Rounding.Down);
    }

    function deposit(uint256 assets, address receiver)
        public
        virtual
        override
        returns (uint256)
    {
        require(
            assets <= maxDeposit(receiver),
            "ERC4626: deposit more than max"
        );
        checkForUpdatedFunds();

        uint256 shares = previewDeposit(assets);
        _deposit(_msgSender(), receiver, assets, shares);

        return shares;
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(
            assets <= maxWithdraw(owner),
            "ERC4626: withdraw more than max"
        );
        checkForUpdatedFunds();

        uint256 shares = previewWithdraw(assets);
        _withdraw(_msgSender(), receiver, owner, assets, shares);

        return shares;
    }

    function setfunderAddr(address _address) public onlyOwner {
        funderAddr = _address;
    }

    function checkForUpdatedFunds() internal {
        IFunder(funderAddr).getPaidFunding(totalAssets());
    }

    // function withdrawAsOwner(uint amount) public onlyOwner {
    //     SafeERC20Upgradeable.safeTransfer(brlcAddress, theOwner, amount);
    // }
}
