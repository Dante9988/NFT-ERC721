import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const cost = ethers.parseEther("0.01"); // 0.01 ETH
  const maxSupply = 1000;
  const allowMintingOn = currentTimestamp + 60; // Allow minting after 1 minute
  const baseURI = "ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/";

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(
    "MyNFT",
    "MNFT",
    cost,
    maxSupply,
    allowMintingOn,
    baseURI
  );

  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
