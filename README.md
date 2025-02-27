# Decentralized Voting dApp

This is a **decentralized voting application** built using **Hardhat (Solidity)** for smart contracts and **Next.js (TypeScript)** for the frontend. The dApp allows users to register as voters, add candidates, start and end voting, and view results transparently on the blockchain.

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
cd decentralized-voting-dapp
```

### 2️⃣ **Install Dependencies**
```bash
# Install dependencies for Hardhat (backend)
cd hardhat
npm install

# Install dependencies for Next.js (frontend)
cd ../frontend
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a `.env` file in both the `hardhat` and `frontend` directories:

#### Backend (`hardhat/.env`):
```
SEPOLIA_RPC_URL=YOUR_INFURA_ALCHEMY_RPC
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=API_KEY
```
 

### 4️⃣ **Compile & Deploy Smart Contract**
```bash
# Navigate to Hardhat directory
cd hardhat

# Compile smart contracts
npx hardhat compile

# Deploy contract (Sepolia or local network)
npx hardhat run scripts/deploy.ts --network sepolia
```

### 5️⃣ **Run the Frontend**
```bash
# Navigate to frontend directory
cd ../voting-client

# Start the Next.js app
npm run dev
```

## 🔥 Usage Guide

### 📌 **Register as a Voter**
1. Connect wallet using MetaMask.
2. Click **"Register as Voter"** (requires contract owner approval).
3. Wait for confirmation.

### 📌 **Add Candidates**
1. Contract owner enters **candidate's wallet address**.
2. Click **"Add Candidate"**.

### 📌 **Start Voting**
1. Contract owner clicks **"Start Voting"**.
2. The voting phase begins.

### 📌 **Vote for a Candidate**
1. Registered voters see the candidate list.
2. Click **"Vote"** next to the chosen candidate.

### 📌 **End Voting & View Results**
1. Contract owner clicks **"End Voting"**.
2. The winner is displayed based on votes.

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
- **Next.js (TypeScript)** - Frontend framework
- **Ethers.js** - Blockchain interaction
- **MetaMask** - Wallet integration
- **Alchemy/Infura** - RPC provider

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch.
3. Commit changes.
4. Open a pull request.

## 📜 License
This project is licensed under the MIT License.

---

Now you can deploy and run your **Decentralized Voting dApp** seamlessly! 🎉
