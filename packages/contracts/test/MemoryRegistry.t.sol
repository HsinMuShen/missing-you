// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MemoryRegistry} from "../src/MemoryRegistry.sol";

contract MemoryRegistryTest is Test {
    MemoryRegistry internal registry;

    bytes32 internal constant MEM_ID = keccak256("memory-1");
    bytes32 internal constant HASH = bytes32(uint256(1));

    address internal alice = address(0xA11CE);

    function setUp() public {
        registry = new MemoryRegistry(address(this));
    }

    function test_anchor_and_verify() public {
        vm.prank(alice);
        registry.anchorMemory(MEM_ID, HASH, false);

        MemoryRegistry.MemoryRecord memory r = registry.getMemory(MEM_ID);
        assertEq(r.owner, alice);
        assertEq(r.contentHash, HASH);
        assertTrue(registry.verifyMemory(MEM_ID, HASH));
        assertFalse(registry.verifyMemory(MEM_ID, bytes32(uint256(2))));
    }

    function test_setShareable_onlyRecordOwner() public {
        vm.prank(alice);
        registry.anchorMemory(MEM_ID, HASH, false);

        vm.prank(alice);
        registry.setShareable(MEM_ID, true);

        MemoryRegistry.MemoryRecord memory r = registry.getMemory(MEM_ID);
        assertTrue(r.shareable);
    }

    function test_pause_blocks_anchor() public {
        registry.pause();
        vm.prank(alice);
        vm.expectRevert();
        registry.anchorMemory(MEM_ID, HASH, false);
    }

    function test_non_owner_cannot_pause() public {
        vm.prank(alice);
        vm.expectRevert();
        registry.pause();
    }
}
