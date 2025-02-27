const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const Voting = await ethers.getContractFactory("Voting");
  
  // Deploy the contract
  const voting = await Voting.deploy();
  
  // Wait for deployment to complete
  await voting.waitForDeployment();
  
  console.log("Voting contract deployed to:", await voting.getAddress());
  console.log("Contract owner:", await voting.owner());
}

// Execute deployment and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });