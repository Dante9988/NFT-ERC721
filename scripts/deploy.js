// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

async function main() {
  const NAME = 'CC3 Punks'
  const SYMBOL = 'CC3P'
  const COST = ether(10)
  const MAX_SUPPLY = 25
  const BASE_URI = 'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'
  const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10) // 2 mins from now
  console.log(ALLOW_MINTING_ON)

  // Deploy Token
  const NFT = await hre.ethers.getContractFactory('NFT')
  let nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

  await nft.deployed()
  console.log(`NFT deployed to: ${nft.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
