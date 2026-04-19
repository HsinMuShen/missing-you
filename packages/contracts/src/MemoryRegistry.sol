// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MemoryRegistry
 * @notice On-chain proof-of-existence for journal memories. **Full journal text stays off-chain** in
 *         PostgreSQL; the contract stores only `memoryId`, `contentHash`, `owner`, `anchoredAt`, and
 *         `shareable`. The BFF hashes a canonical JSON payload (SHA-256 → bytes32) off-chain and passes
 *         that digest here — **no hashing inside the contract** so the app controls canonicalization.
 * @dev `memoryId` is a `bytes32` key; the app derives it as `keccak256(utf8(offChainUuid))` for a stable
 *      mapping between DB UUID and chain storage.
 */
contract MemoryRegistry is Ownable, Pausable {
    struct MemoryRecord {
        bytes32 memoryId;
        bytes32 contentHash;
        address owner;
        uint64 anchoredAt;
        bool shareable;
    }

    error AlreadyAnchored();
    error NotFound();
    error Unauthorized();

    mapping(bytes32 memoryId => MemoryRecord) private _records;
    mapping(bytes32 memoryId => bool) private _anchored;

    event MemoryAnchored(
        bytes32 indexed memoryId,
        bytes32 indexed contentHash,
        address indexed owner_,
        uint64 anchoredAt,
        bool shareable
    );
    event ShareableUpdated(bytes32 indexed memoryId, bool shareable);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Record a new anchor. One record per `memoryId`.
     * @param memoryId Deterministic key (e.g. keccak256 of UUID string).
     * @param contentHash SHA-256 digest of canonical JSON (32 bytes), produced off-chain.
     * @param shareable Whether a public memory page may reference this anchor.
     */
    function anchorMemory(bytes32 memoryId, bytes32 contentHash, bool shareable)
        external
        whenNotPaused
    {
        if (_anchored[memoryId]) revert AlreadyAnchored();
        _records[memoryId] = MemoryRecord({
            memoryId: memoryId,
            contentHash: contentHash,
            owner: _msgSender(),
            anchoredAt: uint64(block.timestamp),
            shareable: shareable
        });
        _anchored[memoryId] = true;
        emit MemoryAnchored(memoryId, contentHash, _msgSender(), uint64(block.timestamp), shareable);
    }

    function getMemory(bytes32 memoryId) external view returns (MemoryRecord memory) {
        if (!_anchored[memoryId]) revert NotFound();
        return _records[memoryId];
    }

    function verifyMemory(bytes32 memoryId, bytes32 contentHash) external view returns (bool) {
        if (!_anchored[memoryId]) return false;
        return _records[memoryId].contentHash == contentHash;
    }

    function setShareable(bytes32 memoryId, bool shareable) external whenNotPaused {
        if (!_anchored[memoryId]) revert NotFound();
        if (_records[memoryId].owner != _msgSender()) revert Unauthorized();
        _records[memoryId].shareable = shareable;
        emit ShareableUpdated(memoryId, shareable);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
