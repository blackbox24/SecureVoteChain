// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VoterRegistry.sol";
import "./CandidateRegistry.sol";
import "./BallotSystem.sol";

/**
 * @title VotingSystem
 * @dev Central contract for managing the entire voting system, including election lifecycle and role-based access control
 */
contract VotingSystem is AccessControl, ReentrancyGuard {
    // Define roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ELECTORAL_COMMISSION_ROLE = keccak256("ELECTORAL_COMMISSION_ROLE");
    
    // Child contracts
    VoterRegistry public voterRegistry;
    CandidateRegistry public candidateRegistry;
    BallotSystem public ballotSystem;
    
    // Election states
    enum ElectionState { 
        NotCreated,
        Created, 
        Ongoing, 
        Paused, 
        Ended 
    }
    
    // Election details structure
    struct ElectionDetails {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
    }
    
    ElectionDetails public currentElection;
    
    // Events
    event ElectionCreated(string title, string description, uint256 startTime, uint256 endTime);
    event ElectionStateChanged(ElectionState previousState, ElectionState newState);
    event ContractsDeployed(address voterRegistry, address candidateRegistry, address ballotSystem);
    event ElectoralCommissionMemberAdded(address member);
    event ElectoralCommissionMemberRemoved(address member);
    
    /**
     * @dev Sets up the contract with initial roles assigned to the deployer
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ELECTORAL_COMMISSION_ROLE, msg.sender);
        
        currentElection.state = ElectionState.NotCreated;
    }
    
    /**
     * @dev Deploy and link all related contracts
     */
    function deployContracts() external onlyRole(ADMIN_ROLE) {
        require(address(voterRegistry) == address(0), "Contracts already deployed");
        
        voterRegistry = new VoterRegistry(address(this));
        candidateRegistry = new CandidateRegistry(address(this));
        ballotSystem = new BallotSystem(address(this), address(candidateRegistry), address(voterRegistry));
        
        emit ContractsDeployed(address(voterRegistry), address(candidateRegistry), address(ballotSystem));
    }
    
    /**
     * @dev Add a member to the electoral commission
     * @param _member Address of the new electoral commission member
     */
    function addElectoralCommissionMember(address _member) external onlyRole(ADMIN_ROLE) {
        grantRole(ELECTORAL_COMMISSION_ROLE, _member);
        emit ElectoralCommissionMemberAdded(_member);
    }
    
    /**
     * @dev Remove a member from the electoral commission
     * @param _member Address of the electoral commission member to remove
     */
    function removeElectoralCommissionMember(address _member) external onlyRole(ADMIN_ROLE) {
        require(_member != msg.sender, "Cannot remove yourself");
        revokeRole(ELECTORAL_COMMISSION_ROLE, _member);
        emit ElectoralCommissionMemberRemoved(_member);
    }
    
    /**
     * @dev Create a new election with the specified parameters
     * @param _title Title of the election
     * @param _description Description of the election
     * @param _startTime Start timestamp of the election
     * @param _durationInDays Duration of the election in days
     */
    function createElection(
        string calldata _title,
        string calldata _description,
        uint256 _startTime,
        uint256 _durationInDays
    ) external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(currentElection.state == ElectionState.NotCreated || currentElection.state == ElectionState.Ended, 
                "Previous election must be ended before creating a new one");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_durationInDays > 0, "Duration must be positive");
        
        uint256 endTime = _startTime + (_durationInDays * 1 days);
        
        currentElection = ElectionDetails({
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: endTime,
            state: ElectionState.Created
        });
        
        // Reset the ballot system for the new election
        if (address(ballotSystem) != address(0)) {
            ballotSystem.resetForNewElection();
        }
        
        emit ElectionCreated(_title, _description, _startTime, endTime);
    }
    
    /**
     * @dev Start the current election
     */
    function startElection() external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(currentElection.state == ElectionState.Created, "Election must be in Created state");
        require(block.timestamp >= currentElection.startTime, "Cannot start before start time");
        require(block.timestamp < currentElection.endTime, "Cannot start after end time");
        
        ElectionState previousState = currentElection.state;
        currentElection.state = ElectionState.Ongoing;
        
        emit ElectionStateChanged(previousState, currentElection.state);
    }
    
    /**
     * @dev Pause the current election
     */
    function pauseElection() external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(currentElection.state == ElectionState.Ongoing, "Election must be ongoing to pause");
        
        ElectionState previousState = currentElection.state;
        currentElection.state = ElectionState.Paused;
        
        emit ElectionStateChanged(previousState, currentElection.state);
    }
    
    /**
     * @dev Resume a paused election
     */
    function resumeElection() external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(currentElection.state == ElectionState.Paused, "Election must be paused to resume");
        require(block.timestamp < currentElection.endTime, "Cannot resume after end time");
        
        ElectionState previousState = currentElection.state;
        currentElection.state = ElectionState.Ongoing;
        
        emit ElectionStateChanged(previousState, currentElection.state);
    }
    
    /**
     * @dev End the current election
     */
    function endElection() external onlyRole(ELECTORAL_COMMISSION_ROLE) {
        require(currentElection.state == ElectionState.Ongoing || 
                currentElection.state == ElectionState.Paused, 
                "Election must be ongoing or paused to end");
        
        ElectionState previousState = currentElection.state;
        currentElection.state = ElectionState.Ended;
        
        emit ElectionStateChanged(previousState, currentElection.state);
    }
    
    /**
     * @dev Check if an election is currently ongoing
     * @return bool True if an election is ongoing
     */
    function isElectionActive() external view returns (bool) {
        return currentElection.state == ElectionState.Ongoing;
    }
    
    /**
     * @dev Get the current election details
     * @return ElectionDetails struct containing election details
     */
    function getElectionDetails() external view returns (ElectionDetails memory) {
        return currentElection;
    }
    
    /**
     * @dev Automatically end the election if the end time has passed
     * @return bool True if the election was ended
     */
    function checkAndUpdateElectionState() external returns (bool) {
        if (currentElection.state == ElectionState.Ongoing && 
            block.timestamp >= currentElection.endTime) {
            
            ElectionState previousState = currentElection.state;
            currentElection.state = ElectionState.Ended;
            
            emit ElectionStateChanged(previousState, currentElection.state);
            return true;
        }
        return false;
    }
    
    /**
     * @dev Check if an address has the electoral commission role
     * @param _address Address to check
     * @return bool True if the address has the role
     */
    function isElectoralCommission(address _address) external view returns (bool) {
        return hasRole(ELECTORAL_COMMISSION_ROLE, _address);
    }
}