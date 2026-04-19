// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MemoryRegistry} from "../src/MemoryRegistry.sol";

/**
 * @notice Deploy `MemoryRegistry` with `msg.sender` as Ownable admin (pause/unpause).
 * @dev   forge script script/Deploy.s.sol:DeployScript --rpc-url $POLYGON_AMOY_RPC_URL --broadcast
 */
contract DeployScript is Script {
    function run() external {
        address deployer = msg.sender;
        vm.startBroadcast();
        MemoryRegistry registry = new MemoryRegistry(deployer);
        console2.log("MemoryRegistry:", address(registry));
        console2.log("Owner (pause admin):", deployer);
        vm.stopBroadcast();
    }
}
