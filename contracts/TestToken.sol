// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract TestToken is ERC20PresetFixedSupply {
    constructor() ERC20PresetFixedSupply("Test token", "TEST", 1000 ether, msg.sender) {
    }
}
