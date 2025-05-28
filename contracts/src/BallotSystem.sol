// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VoterRegistry.sol";
import "./CandidateRegistry.sol";

/**
 * @title BallotSystem
 * @dev Contract for managing the voting process and counting votes in real-time
 */
contract BallotSystem is AccessControl, ReentrancyGuard {
    // Define roles
    bytes32 public constant ELECTORAL_COMMISSION_ROLE = keccak256("ELECTORAL_COMMISSION_ROLE");
    
    // Reference to related contracts
    address public votingSystemAddress;
    CandidateRegistry public candidateRegistry;
    VoterRegistry public voterRegistry;
    
    // Mapping from candidate ID to vote count
    mapping(uint256 => uint256) public voteCounts;
    
    // Total votes cast in the current election
    uint256 public totalVotesCast;
    
    // Events
    event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 newVoteCount);
    event BallotSystemReset();
    
    /**
     * @dev Sets up the ballot system with references to related contracts
     * @param _votingSystemAddress Address of the VotingSystem contract
     * @param _candidateRegistryAddress Address of the CandidateRegistry contract
     * @param _voterRegistryAddress Address of the VoterRegistry contract
     */
    constructor(
        address _votingSystemAddress,
        address _candidateRegistryAddress,
        address _voterRegistryAddress
    ) {
        votingSystemAddress = _votingSystemAddress;
        candidateRegistry = CandidateRegistry(_candidateRegistryAddress);
        voterRegistry = VoterRegistry(_voterRegistryAddress);
        
        _grantRole(DEFAULT_ADMIN_ROLE, _votingSystemAddress);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId The ID of the candidate to vote for
     */
    function castVote(uint256 _candidateId) external nonReentrant {
        // Check if the election is active (through the VotingSystem contract)
        (bool success, bytes memory result) = votingSystemAddress.call(
            abi.encodeWithSignature("isElectionActive()")
        );
        require(success && abi.decode(result, (bool)), "Election is not active");
        
        // Check if the candidate is registered
        require(candidateRegistry.isRegisteredCandidate(_candidateId), "Candidate is not registered");
        
        // Check if the voter is registered and has not voted
        require(voterRegistry.isRegisteredVoter(msg.sender), "Voter is not registered");
        require(!voterRegistry.hasVoted(msg.sender), "Voter has already voted");
        
        // Mark the voter as having voted
        voterRegistry.markVoterAsVoted(msg.sender);
        
        // Increment the vote count for the candidate
        voteCounts[_candidateId]++;
        totalVotesCast++;
        
        // Emit an event for real-time updates
        emit VoteCast(msg.sender, _candidateId, voteCounts[_candidateId]);
    }
    
    /**
     * @dev Get the current vote count for a specific candidate
     * @param _candidateId The ID of the candidate
     * @return uint256 The number of votes for the candidate
     */
    function getVoteCount(uint256 _candidateId) external view returns (uint256) {
        return voteCounts[_candidateId];
    }
    
    /**
     * @dev Get the current vote counts for all candidates
     * @return uint256[] Array of candidate IDs
     * @return uint256[] Array of vote counts corresponding to the candidate IDs
     */
    function getAllVoteCounts() external view returns (uint256[] memory, uint256[] memory) {
        CandidateRegistry.Candidate[] memory allCandidates = candidateRegistry.getAllCandidates();
        
        uint256[] memory candidateIds = new uint256[](allCandidates.length);
        uint256[] memory votes = new uint256[](allCandidates.length);
        
        for (uint256 i = 0; i < allCandidates.length; i++) {
            candidateIds[i] = allCandidates[i].candidateId;
            votes[i] = voteCounts[allCandidates[i].candidateId];
        }
        
        return (candidateIds, votes);
    }
    
    /**
     * @dev Get the current vote counts for active candidates only
     * @return uint256[] Array of candidate IDs
     * @return uint256[] Array of vote counts corresponding to the candidate IDs
     */
    function getActiveVoteCounts() external view returns (uint256[] memory, uint256[] memory) {
        CandidateRegistry.Candidate[] memory activeCandidates = candidateRegistry.getActiveCandidates();
        
        uint256[] memory candidateIds = new uint256[](activeCandidates.length);
        uint256[] memory votes = new uint256[](activeCandidates.length);
        
        for (uint256 i = 0; i < activeCandidates.length; i++) {
            candidateIds[i] = activeCandidates[i].candidateId;
            votes[i] = voteCounts[activeCandidates[i].candidateId];
        }
        
        return (candidateIds, votes);
    }
    
    /**
     * @dev Get detailed results including candidate information and vote counts
     * @return candidateIds Array of candidate IDs
     * @return names Array of candidate names
     * @return parties Array of candidate parties
     * @return voteCounts Array of vote counts
     * @return percentages Array of vote percentages (multiplied by 100 for precision)
     */
    function getDetailedResults() external view returns (
        uint256[] memory candidateIds,
        string[] memory names,
        string[] memory parties,
        uint256[] memory votes,
        uint256[] memory percentages
    ) {
        CandidateRegistry.Candidate[] memory allCandidates = candidateRegistry.getActiveCandidates();
        
        candidateIds = new uint256[](allCandidates.length);
        names = new string[](allCandidates.length);
        parties = new string[](allCandidates.length);
        votes = new uint256[](allCandidates.length);
        percentages = new uint256[](allCandidates.length);
        
        for (uint256 i = 0; i < allCandidates.length; i++) {
            candidateIds[i] = allCandidates[i].candidateId;
            names[i] = allCandidates[i].name;
            parties[i] = allCandidates[i].party;
            votes[i] = voteCounts[allCandidates[i].candidateId];
            
            // Calculate percentage (multiplied by 10000 for precision)
            if (totalVotesCast > 0) {
                percentages[i] = (votes[i] * 10000) / totalVotesCast;
            } else {
                percentages[i] = 0;
            }
        }
        
        return (candidateIds, names, parties, votes, percentages);
    }
    
    /**
     * @dev Reset the ballot system for a new election
     */
    function resetForNewElection() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Reset vote counts for all candidates
        CandidateRegistry.Candidate[] memory allCandidates = candidateRegistry.getAllCandidates();
        
        for (uint256 i = 0; i < allCandidates.length; i++) {
            voteCounts[allCandidates[i].candidateId] = 0;
        }
        
        totalVotesCast = 0;
        
        emit BallotSystemReset();
    }
    
    /**
     * @dev Get the total number of votes cast
     * @return uint256 Total votes cast
     */
    function getTotalVotes() external view returns (uint256) {
        return totalVotesCast;
    }
    
    /**
     * @dev Get the leading candidate(s)
     * @return uint256[] Array of candidate IDs with the highest vote count
     * @return uint256 The highest vote count
     */
    function getLeadingCandidates() external view returns (uint256[] memory, uint256) {
        CandidateRegistry.Candidate[] memory activeCandidates = candidateRegistry.getActiveCandidates();
        
        // Find the highest vote count
        uint256 highestVoteCount = 0;
        for (uint256 i = 0; i < activeCandidates.length; i++) {
            uint256 candidateVotes = voteCounts[activeCandidates[i].candidateId];
            if (candidateVotes > highestVoteCount) {
                highestVoteCount = candidateVotes;
            }
        }
        
        // Count how many candidates have the highest vote count
        uint256 leaderCount = 0;
        for (uint256 i = 0; i < activeCandidates.length; i++) {
            if (voteCounts[activeCandidates[i].candidateId] == highestVoteCount) {
                leaderCount++;
            }
        }
        
        // Create array of leading candidate IDs
        uint256[] memory leadingCandidates = new uint256[](leaderCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < activeCandidates.length; i++) {
            if (voteCounts[activeCandidates[i].candidateId] == highestVoteCount) {
                leadingCandidates[index] = activeCandidates[i].candidateId;
                index++;
            }
        }
        
        return (leadingCandidates, highestVoteCount);
    }
}