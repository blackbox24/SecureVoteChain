// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VoterRegistry
 * @dev Contract for managing voter registration and verification
 */
contract VoterRegistry is AccessControl, ReentrancyGuard {
    // Define roles
    bytes32 public constant ELECTORAL_COMMISSION_ROLE = keccak256("ELECTORAL_COMMISSION_ROLE");
    
    // Voter struct to store voter information
    struct Voter {
        string voterId;           // Government-issued voter ID
        address walletAddress;    // Associated wallet address
        bool isRegistered;        // Registration status
        bool hasVoted;            // Whether the voter has voted in the current election
        uint256 registrationTime; // When the voter was registered
    }
    
    // Mapping from wallet address to voter
    mapping(address => Voter) public voters;
    
    // Mapping from voter ID to wallet address to prevent duplicate registrations
    mapping(string => address) public voterIdToAddress;
    
    // Total number of registered voters
    uint256 public totalVoters;
    
    // Events
    event VoterRegistered(address indexed walletAddress, string voterId);
    event VoterStatusUpdated(address indexed walletAddress, bool isRegistered);
    event VoterVoted(address indexed walletAddress);
    event VoterReset(address indexed walletAddress);
    
    /**
     * @dev Sets up the contract with roles from the VotingSystem
     * @param votingSystemAddress Address of the VotingSystem contract
     */
    constructor(address votingSystemAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, votingSystemAddress);
    }
    
    /**
     * @dev Register a new voter with their ID and wallet address
     * @param _voterId The government-issued voter ID
     * @param _walletAddress The wallet address to associate with the voter
     */
    function registerVoter(
        string calldata _voterId, 
        address _walletAddress
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) nonReentrant {
        require(bytes(_voterId).length > 0, "Voter ID cannot be empty");
        require(_walletAddress != address(0), "Invalid wallet address");
        require(!voters[_walletAddress].isRegistered, "Wallet address already registered");
        require(voterIdToAddress[_voterId] == address(0), "Voter ID already registered");
        
        voters[_walletAddress] = Voter({
            voterId: _voterId,
            walletAddress: _walletAddress,
            isRegistered: true,
            hasVoted: false,
            registrationTime: block.timestamp
        });
        
        voterIdToAddress[_voterId] = _walletAddress;
        totalVoters++;
        
        emit VoterRegistered(_walletAddress, _voterId);
    }
    
    /**
     * @dev Update a voter's registration status
     * @param _walletAddress The wallet address of the voter
     * @param _isRegistered The new registration status
     */
    function updateVoterStatus(
        address _walletAddress, 
        bool _isRegistered
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(voters[_walletAddress].walletAddress != address(0), "Voter does not exist");
        
        if (voters[_walletAddress].isRegistered && !_isRegistered) {
            totalVoters--;
        } else if (!voters[_walletAddress].isRegistered && _isRegistered) {
            totalVoters++;
        }
        
        voters[_walletAddress].isRegistered = _isRegistered;
        
        emit VoterStatusUpdated(_walletAddress, _isRegistered);
    }
    
    /**
     * @dev Verify if a voter ID is associated with the given wallet address
     * @param _voterId The government-issued voter ID
     * @param _walletAddress The wallet address to verify
     * @return bool True if the voter ID and wallet address match
     */
    function verifyVoter(
        string calldata _voterId, 
        address _walletAddress
    ) external view returns (bool) {
        return (
            voters[_walletAddress].isRegistered && 
            keccak256(bytes(voters[_walletAddress].voterId)) == keccak256(bytes(_voterId))
        );
    }
    
    /**
     * @dev Mark a voter as having voted in the current election
     * @param _voterAddress The address of the voter
     */
    function markVoterAsVoted(address _voterAddress) external {
        // Only the ballot system (through VotingSystem) can mark a voter as voted
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
                tx.origin == msg.sender && hasRole(ELECTORAL_COMMISSION_ROLE, tx.origin), 
                "Unauthorized");
        
        require(voters[_voterAddress].isRegistered, "Voter not registered");
        require(!voters[_voterAddress].hasVoted, "Voter has already voted");
        
        voters[_voterAddress].hasVoted = true;
        
        emit VoterVoted(_voterAddress);
    }
    
    /**
     * @dev Reset all voters' voted status for a new election
     */
    function resetVotersForNewElection() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // This can be optimized in production with partial resets or alternative data structures
        address[] memory voterAddresses = new address[](totalVoters);
        uint256 count = 0;
        
        // Collect addresses first to avoid state changes during iteration
        address currentAddress = address(0x1); // Start with non-zero address
        while (count < totalVoters && currentAddress < address(0xffffffffffffffffffffffffffffffffffffffff)) {
            currentAddress++;
            if (voters[currentAddress].isRegistered) {
                voterAddresses[count] = currentAddress;
                count++;
            }
        }
        
        // Now reset the collected addresses
        for (uint256 i = 0; i < count; i++) {
            voters[voterAddresses[i]].hasVoted = false;
            emit VoterReset(voterAddresses[i]);
        }
    }
    
    /**
     * @dev Check if a voter has already voted
     * @param _voterAddress The address of the voter
     * @return bool True if the voter has voted
     */
    function hasVoted(address _voterAddress) external view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }
    
    /**
     * @dev Check if a voter is registered
     * @param _voterAddress The address of the voter
     * @return bool True if the voter is registered
     */
    function isRegisteredVoter(address _voterAddress) external view returns (bool) {
        return voters[_voterAddress].isRegistered;
    }
    
    /**
     * @dev Get a voter's information
     * @param _voterAddress The address of the voter
     * @return Voter The voter's information
     */
    function getVoter(address _voterAddress) external view returns (Voter memory) {
        return voters[_voterAddress];
    }
    
    /**
     * @dev Get the wallet address associated with a voter ID
     * @param _voterId The voter ID to look up
     * @return address The associated wallet address
     */
    function getVoterAddress(string calldata _voterId) external view returns (address) {
        return voterIdToAddress[_voterId];
    }
}