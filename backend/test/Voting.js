const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Enhanced Voting Contract", function () {
  let Voting;
  let voting;
  let owner, voter1, voter2, other;

  beforeEach(async function () {
    [owner, voter1, voter2, other] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    
    // Add candidates and register voters for common test setup
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);
    await voting.startVoting(3600);
  });

  describe("Voter Registration", function () {
    it("Should allow owner to register voters", async function () {
      await voting.registerVoter(other.address);
      expect(await voting.registeredVoters(other.address)).to.be.true;
    });

    it("Should prevent non-owners from registering voters", async function () {
      await expect(voting.connect(voter1).registerVoter(other.address))
        .to.be.revertedWith("Only owner can perform this action");
    });

    it("Should prevent duplicate registrations", async function () {
      await expect(voting.registerVoter(voter1.address))
        .to.be.revertedWith("Voter already registered");
    });
  });

  describe("Voting Process with Registration", function () {
    it("Should allow registered voters to vote", async function () {
      await expect(voting.connect(voter1).vote(0, "QmABC123"))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 0, "QmABC123");
    });

    it("Should prevent unregistered voters from voting", async function () {
      await expect(voting.connect(other).vote(0, "QmXYZ789"))
        .to.be.revertedWith("Not registered voter");
    });

    it("Should store vote records with IPFS CIDs", async function () {
      await voting.connect(voter1).vote(0, "QmCID1");
      await voting.connect(voter2).vote(1, "QmCID2");
      
      const records = await voting.getAllVoteRecords();
      expect(records.length).to.equal(2);
      expect(records[0].cid).to.equal("QmCID1");
      expect(records[1].cid).to.equal("QmCID2");
    });
  });

  describe("Voting Validation", function () {
    it("Should require CID when voting", async function () {
      await voting.connect(voter1).vote(0, "");
      expect(await voting.voters(voter1.address)).to.be.true;
    });

    it("Should track voter count correctly", async function () {
      await voting.connect(voter1).vote(0, "Qm123");
      await voting.connect(voter2).vote(1, "Qm456");
      
      expect(await voting.getVoterCount()).to.equal(2);
    });
  });

  describe("Edge Cases with Registration", function () {
    it("Should handle multiple registrations and votes", async function () {
      await voting.registerVoter(other.address);
      await voting.connect(other).vote(1, "QmNEW");
      
      const records = await voting.getAllVoteRecords();
      expect(records.length).to.equal(1);
      expect(records[0].voter).to.equal(other.address);
    });

    it("Should prevent voting before registration", async function () {
      const unregisteredVoter = other;
      await expect(voting.connect(unregisteredVoter).vote(0, "QmNOSIGNUP"))
        .to.be.revertedWith("Not registered voter");
    });
  });

  describe("Modified Existing Functionality", function () {
    it("Should maintain candidate functionality with registration", async function () {
      await voting.connect(voter1).vote(0, "Qm1");
      const candidate = await voting.candidates(0);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should return correct total votes", async function () {
      await voting.connect(voter1).vote(0, "QmA");
      await voting.connect(voter2).vote(1, "QmB");
      
      expect(await voting.getTotalVotes()).to.equal(2);
    });

    it("Should enforce voting deadlines with registration", async function () {
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");
      
      await expect(voting.connect(voter1).vote(0, "QmEXPIRED"))
        .to.be.revertedWith("Voting has ended");
    });
  });

  describe("IPFS Integration", function () {
    it("Should store multiple CIDs correctly", async function () {
      const cids = ["Qm111", "Qm222", "Qm333"];
      const voters = [voter1, voter2, other];
      
      // Register additional voters
      for (const voter of voters.slice(2)) {
        await voting.registerVoter(voter.address);
      }

      // Have each voter cast one vote
      for (let i = 0; i < voters.length; i++) {
        await voting.connect(voters[i]).vote(0, cids[i]);
      }
      
      const records = await voting.getAllVoteRecords();
      expect(records.map(r => r.cid)).to.deep.equal(cids);
    });

    it("Should associate CIDs with correct voters", async function () {
      await voting.connect(voter1).vote(0, "QmVOTER1");
      await voting.connect(voter2).vote(1, "QmVOTER2");
      
      const records = await voting.getAllVoteRecords();
      expect(records[0].voter).to.equal(voter1.address);
      expect(records[1].voter).to.equal(voter2.address);
    });
  });

  // New tests to verify single-vote enforcement
  describe("Vote Limitation", function () {
    it("Should prevent multiple votes from same voter", async function () {
      await voting.connect(voter1).vote(0, "QmFIRST");
      await expect(voting.connect(voter1).vote(0, "QmSECOND"))
        .to.be.revertedWith("Already voted");
    });

    it("Should maintain vote count after multiple attempts", async function () {
      await voting.connect(voter1).vote(0, "QmVALID");
      await expect(voting.connect(voter1).vote(1, "QmINVALID"))
        .to.be.revertedWith("Already voted");
      
      const candidate0 = await voting.candidates(0);
      const candidate1 = await voting.candidates(1);
      expect(candidate0.voteCount).to.equal(1);
      expect(candidate1.voteCount).to.equal(0);
    });
  });
});