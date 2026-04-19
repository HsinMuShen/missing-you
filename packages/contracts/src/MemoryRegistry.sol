// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MemoryRegistry
 * @notice Anchors a cryptographic commitment to journal content. Full journal text is stored
 *         off-chain (e.g. PostgreSQL); only `memoryId`, `contentHash`, owner, timestamp, and
 *         shareable flag live on-chain.
 * @dev `memoryId` is a bytes32 identifier (e.g. keccak256 of an off-chain UUID) for gas-efficient keys.
 */
contract MemoryRegistry {
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
    error Paused();

    mapping(bytes32 memoryId => MemoryRecord) private _records;
    mapping(bytes32 memoryId => bool) private _anchored;

    address public owner;
    bool public paused;

    event MemoryAnchored(
        bytes32 indexed memoryId,
        bytes32 indexed contentHash,
        address indexed owner_,
        uint64 anchoredAt,
        bool shareable
    );
    event ShareableUpdated(bytes32 indexed memoryId, bool shareable);
    event Paused(address account);
    event Unpaused(address account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Record a new memory anchor. Callable once per `memoryId`.
     * @param memoryId Off-chain-derived id (fixed 32 bytes).
     * @param contentHash Commitment to canonical payload (e.g. keccak256 of normalized JSON).
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
            owner: msg.sender,
            anchoredAt: uint64(block.timestamp),
            shareable: shareable
        });
        _anchored[memoryId] = true;
        emit MemoryAnchored(memoryId, contentHash, msg.sender, uint64(block.timestamp), shareable);
    }

    function getMemory(bytes32 memoryId) external view returns (MemoryRecord memory) {
        if (!_anchored[memoryId]) revert NotFound();
        return _records[memoryId];
    }

    /// @notice Returns true if the registry holds the same content hash for this memory id.
    function verifyMemory(bytes32 memoryId, bytes32 contentHash) external view returns (bool) {
        if (!_anchored[memoryId]) return false;
        return _records[memoryId].contentHash == contentHash;
    }

    function setShareable(bytes32 memoryId, bool shareable) external whenNotPaused {
        if (!_anchored[memoryId]) revert NotFound();
        if (_records[memoryId].owner != msg.sender) revert Unauthorized();
        _records[memoryId].shareable = shareable;
        emit ShareableUpdated(memoryId, shareable);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        address previous = owner;
        owner = newOwner;
        emit OwnershipTransferred(previous, newOwner);
    }
}
