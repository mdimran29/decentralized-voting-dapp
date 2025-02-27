// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public owner;
    
    struct Candidate {
        string name;
        uint voteCount;
    }
    
    struct VoteRecord {
        address voter;
        uint candidateId;
        string cid;
    }

    Candidate[] public candidates;
    VoteRecord[] public voteRecords;
    
    mapping(address => bool) public registeredVoters;
    mapping(address => bool) public voters;
    mapping(address => bool) public candidatesVoted;
    
    bool public votingActive;
    uint public votingDeadline;
    
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, uint indexed candidateId, string cid);
    event VotingStarted(uint deadline);
    event VotingEnded();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier votingOpen() {
        require(votingActive, "Voting is not active");
        require(block.timestamp <= votingDeadline, "Voting has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Voter registration function
    function registerVoter(address _voter) external onlyOwner {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function addCandidate(string memory _name) public onlyOwner {
        require(!votingActive, "Cannot add candidates while voting is active");
        candidates.push(Candidate(_name, 0));
    }

    function startVoting(uint _duration) external onlyOwner {
        require(!votingActive, "Voting is already active");
        require(candidates.length > 0, "No candidates available");
        
        votingActive = true;
        votingDeadline = block.timestamp + _duration;
        emit VotingStarted(votingDeadline);
    }

    function endVoting() external onlyOwner {
        require(votingActive, "Voting is not active");
        votingActive = false;
        emit VotingEnded();
    }

    function vote(uint _candidateId, string memory _cid) external votingOpen {
        require(registeredVoters[msg.sender], "Not registered voter");
        require(!voters[msg.sender], "Already voted");
        require(_candidateId < candidates.length, "Invalid candidate");
        require(!candidatesVoted[msg.sender], "Candidates cannot vote");
        
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        voteRecords.push(VoteRecord(msg.sender, _candidateId, _cid));
        emit VoteCast(msg.sender, _candidateId, _cid);
    }

    // Additional view functions
    function getAllVoteRecords() external view returns (VoteRecord[] memory) {
        return voteRecords;
    }

    function getVoterCount() external view returns (uint) {
        return voteRecords.length;
    }

    // Existing view functions remain the same
    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getWinner() external view returns (uint) {
        require(!votingActive, "Voting is still active");
        require(candidates.length > 0, "No candidates");
        
        uint maxVotes = 0;
        uint winnerId = 0;
        
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        return winnerId;
    }

    function isVotingActive() external view returns (bool) {
        return votingActive && block.timestamp <= votingDeadline;
    }
    
    function getTotalVotes() external view returns (uint totalVotes) {
        for (uint i = 0; i < candidates.length; i++) {
            totalVotes += candidates[i].voteCount;
        }
    }
}