const { ethers } = require("hardhat");
const { config } = require("dotenv");

config();

async function main() {
  // Common parameters
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const cost = ethers.utils.parseEther("0.01"); // 0.01 ETH
  const maxSupply = 1000;
  const allowMintingOn = currentTimestamp + 60; // Allow minting after 1 minute
  const baseURI = "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/"; // Example CID - replace with your actual CID

  // EIP-1559 gas parameters
  const deploymentConfig = {
    maxFeePerGas: ethers.utils.parseUnits("3000", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei")
  };

  // Deploy 5 ERC1155 contracts
  console.log("Deploying ERC1155 contracts...");
  const ERC1155Contracts = [];
  const deployParams = [];

  for (let i = 0; i < 5; i++) {
    const name = `CRYPTOPUNKS1155 ${i + 1}`;
    const symbol = `CPP1155${i + 1}`;
    
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    const nft1155 = await NFT1155.deploy(
      name,
      symbol,
      baseURI,
      cost,
      maxSupply,
      allowMintingOn,
      { ...deploymentConfig }
    );

    await nft1155.deployed();
    ERC1155Contracts.push(nft1155.address);
    console.log(`ERC1155 ${i + 1} deployed to:`, nft1155.address);

    // Store parameters for verification
    deployParams.push({
      address: nft1155.address,
      constructorArguments: [
        name,
        symbol,
        baseURI,
        cost,
        maxSupply,
        allowMintingOn
      ]
    });
  }

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Gas Parameters Used:");
  console.log("maxFeePerGas:", ethers.utils.formatUnits(deploymentConfig.maxFeePerGas, "gwei"), "gwei");
  console.log("maxPriorityFeePerGas:", ethers.utils.formatUnits(deploymentConfig.maxPriorityFeePerGas, "gwei"), "gwei");
  console.log("===================");
  
  deployParams.forEach((params, i) => {
    console.log(`\nContract ${i + 1}:`);
    console.log("Address:", params.address);
    console.log("Verify Command:");
    console.log(`npx hardhat verify --network cc3 ${params.address} "${params.constructorArguments[0]}" "${params.constructorArguments[1]}" "${params.constructorArguments[2]}" "${params.constructorArguments[3]}" "${params.constructorArguments[4]}" "${params.constructorArguments[5]}"`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Commented IPFS Code for reference
const https = require("https");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function uploadFileToIPFS(filePath) {
  // ... implementation ...
}

async function uploadFolderToIPFS(folderPath) {
  // ... implementation ...
}

async function pinHash(hash) {
  // ... implementation ...
}
*/ 
