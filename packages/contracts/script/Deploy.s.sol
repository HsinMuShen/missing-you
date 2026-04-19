// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MemoryRegistry} from "../src/MemoryRegistry.sol";

/**
 * @notice Deploy scaffold — run with:
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --broadcast
 * @dev Set SEPOLIA_RPC_URL and deployer private key (e.g. --private-key or cast wallet) in your environment.
 */
contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        MemoryRegistry registry = new MemoryRegistry();
        console2.log("MemoryRegistry deployed at:", address(registry));
        vm.stopBroadcast();
    }
}
