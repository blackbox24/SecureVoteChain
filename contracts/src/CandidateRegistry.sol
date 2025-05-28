// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CandidateRegistry
 * @dev Contract for managing candidate registration and information
 */
contract CandidateRegistry is AccessControl, ReentrancyGuard {
    // Define roles
    bytes32 public constant ELECTORAL_COMMISSION_ROLE = keccak256("ELECTORAL_COMMISSION_ROLE");
    
    // Candidate struct to store candidate information
    struct Candidate {
        uint256 candidateId;       // Unique identifier
        string name;               // Full name
        string information;        // Candidate information/manifesto
        string imageReference;     // IPFS or other reference to candidate image
        string party;              // Political party (if applicable)
        bool isRegistered;         // Registration status
        uint256 registrationTime;  // When the candidate was registered
    }
    
    // Array to store all candidates
    Candidate[] public candidates;
    
    // Mapping to quickly check if a candidate ID exists
    mapping(uint256 => bool) public candidateExists;
    
    // Total number of registered candidates
    uint256 public totalCandidates;
    
    // Events
    event CandidateRegistered(uint256 indexed candidateId, string name, string party);
    event CandidateStatusUpdated(uint256 indexed candidateId, bool isRegistered);
    event CandidateInformationUpdated(uint256 indexed candidateId, string information, string imageReference);
    
    /**
     * @dev Sets up the contract with roles from the VotingSystem
     * @param votingSystemAddress Address of the VotingSystem contract
     */
    constructor(address votingSystemAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, votingSystemAddress);
    }
    
    /**
     * @dev Register a new candidate with their details
     * @param _name Candidate's name
     * @param _information Candidate's information or manifesto
     * @param _imageReference Reference to candidate's image (IPFS hash or URL)
     * @param _party Candidate's political party
     * @return candidateId The unique ID assigned to the candidate
     */
    function registerCandidate(
        string calldata _name,
        string calldata _information,
        string calldata _imageReference,
        string calldata _party
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) nonReentrant returns (uint256) {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        // Generate a new candidate ID
        uint256 newCandidateId = totalCandidates + 1;
        
        // Create and store the new candidate
        Candidate memory newCandidate = Candidate({
            candidateId: newCandidateId,
            name: _name,
            information: _information,
            imageReference: _imageReference,
            party: _party,
            isRegistered: true,
            registrationTime: block.timestamp
        });
        
        candidates.push(newCandidate);
        candidateExists[newCandidateId] = true;
        totalCandidates++;
        
        emit CandidateRegistered(newCandidateId, _name, _party);
        
        return newCandidateId;
    }
    
    /**
     * @dev Update a candidate's registration status
     * @param _candidateId The ID of the candidate
     * @param _isRegistered The new registration status
     */
    function updateCandidateStatus(
        uint256 _candidateId,
        bool _isRegistered
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(candidateExists[_candidateId], "Candidate does not exist");
        
        uint256 index = getCandidateIndex(_candidateId);
        candidates[index].isRegistered = _isRegistered;
        
        emit CandidateStatusUpdated(_candidateId, _isRegistered);
    }
    
    /**
     * @dev Update a candidate's information
     * @param _candidateId The ID of the candidate
     * @param _information New candidate information
     * @param _imageReference New image reference
     */
    function updateCandidateInformation(
        uint256 _candidateId,
        string calldata _information,
        string calldata _imageReference
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(candidateExists[_candidateId], "Candidate does not exist");
        
        uint256 index = getCandidateIndex(_candidateId);
        candidates[index].information = _information;
        candidates[index].imageReference = _imageReference;
        
        emit CandidateInformationUpdated(_candidateId, _information, _imageReference);
    }
    
    /**
     * @dev Get all registered candidates
     * @return Candidate[] Array of all registered candidates
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }
    
    /**
     * @dev Get only active (registered) candidates
     * @return Candidate[] Array of active candidates
     */
    function getActiveCandidates() external view returns (Candidate[] memory) {
        uint256 activeCount = 0;
        
        // First, count active candidates
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].isRegistered) {
                activeCount++;
            }
        }
        
        // Create and populate the result array
        Candidate[] memory activeCandidates = new Candidate[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].isRegistered) {
                activeCandidates[currentIndex] = candidates[i];
                currentIndex++;
            }
        }
        
        return activeCandidates;
    }
    
    /**
     * @dev Check if a candidate is registered
     * @param _candidateId The ID of the candidate
     * @return bool True if the candidate is registered
     */
    function isRegisteredCandidate(uint256 _candidateId) external view returns (bool) {
        if (!candidateExists[_candidateId]) {
            return false;
        }
        
        uint256 index = getCandidateIndex(_candidateId);
        return candidates[index].isRegistered;
    }
    
    /**
     * @dev Get a candidate's information by ID
     * @param _candidateId The ID of the candidate
     * @return Candidate The candidate's information
     */
    function getCandidate(uint256 _candidateId) external view returns (Candidate memory) {
        require(candidateExists[_candidateId], "Candidate does not exist");
        
        uint256 index = getCandidateIndex(_candidateId);
        return candidates[index];
    }
    
    /**
     * @dev Internal function to get a candidate's index in the array
     * @param _candidateId The ID of the candidate
     * @return uint256 The index of the candidate in the array
     */
    function getCandidateIndex(uint256 _candidateId) internal view returns (uint256) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateId == _candidateId) {
                return i;
            }
        }
        revert("Candidate not found");
    }
}