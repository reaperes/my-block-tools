// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchTransfer {
    function batchTransfer(address[] calldata addresses, uint256[] calldata amounts) external payable {
        for (uint256 i=0; i<addresses.length; i++) {
            (bool success,) = addresses[i].call{value: amounts[i]}("");
            require(success);
        }
    }

    function batchTransferERC20(address token, address[] calldata addresses, uint256[] calldata amounts) external {
        IERC20 testToken = IERC20(token);
        for (uint256 i=0; i<addresses.length; i++) {
            testToken.transferFrom(msg.sender, addresses[i], amounts[i]);
        }
    }
}
