import { ethers } from "hardhat";

async function main() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const cost = ethers.utils.parseEther("0.01"); // 0.01 ETH
  const maxSupply = 1000;
  const allowMintingOn = currentTimestamp + 60; // Allow minting after 1 minute
  const baseURI = "ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/";
  console.log(allowMintingOn)

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(
    "CRYPTOPUNKS",
    "CPP",
    cost,
    maxSupply,
    allowMintingOn,
    baseURI
  );

  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
  console.log("Contract address for Artillery config:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
