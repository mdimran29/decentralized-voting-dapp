# Decentralized Voting dApp - Hardhat

This is a **decentralized voting application** built using **Hardhat (Solidity)** for smart contracts. The dApp allows users to register as voters, add candidates, start and end voting, and view results transparently on the blockchain.

## 🛠 Features

### 🔹 Smart Contract Functions

#### ✅ **Voting Operations**
- `addCandidate(address candidateAddress)` - Adds a new candidate.
- `registerVoter(address voterAddress)` - Registers a voter.
- `startVoting()` - Starts the voting process.
- `vote(uint candidateId)` - Allows a registered voter to vote.
- `endVoting()` - Ends the voting process.

#### 📊 **Data Retrieval**
- `candidates(uint index)` - Fetches details of a candidate.
- `candidatesVoted(address voter)` - Checks if a voter has voted.
- `getAllCandidates()` - Returns a list of all candidates.
- `getAllVoteRecords()` - Retrieves all votes recorded.
- `getTotalVotes()` - Gets the total number of votes.
- `getVoterCount()` - Returns the number of registered voters.
- `getWinner()` - Determines the winning candidate.
- `isVotingActive()` - Checks if voting is currently active.
- `owner()` - Returns the contract owner.
- `registeredVoters(address voter)` - Checks if an address is a registered voter.
- `voteRecords(uint index)` - Fetches a specific vote record.
- `voters(address voterAddress)` - Retrieves voter details.
- `votingActive()` - Indicates if voting is active.

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/mdimran29/decentralized-voting-dapp.git
cd decentralized-voting-dapp/backend
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a `.env` file in the `hardhat` directory:
```
SEPOLIA_RPC_URL=YOUR_INFURA_ALCHEMY_RPC
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=API_KEY
```

### 4️⃣ **Compile & Deploy Smart Contract**
```bash
# Compile smart contracts
npx hardhat compile

# Deploy contract (Sepolia or local network)
npx hardhat run scripts/deploy.ts --network sepolia
```

## 🎯 Smart Contract Interaction (Manually via Hardhat Console)

### Register a Voter:
```javascript
await contract.registerVoter("0xUserAddress");
```

### Add a Candidate:
```javascript
await contract.addCandidate("0xCandidateAddress");
```

### Start Voting:
```javascript
await contract.startVoting();
```

### Vote for a Candidate:
```javascript
await contract.vote(1); // Assuming candidate ID is 1
```

### End Voting:
```javascript
await contract.endVoting();
```

### Get Winner:
```javascript
await contract.getWinner();
```

## 🏗 Tech Stack
- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development framework
- **Ethers.js** - Blockchain interaction
- **Alchemy/Infura** - RPC provider

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch.
3. Commit changes.
4. Open a pull request.

## 📜 License
This project is licensed under the MIT License.

---

Now you can deploy and run your **Decentralized Voting Smart Contract** seamlessly! 🎉
