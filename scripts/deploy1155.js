const hre = require("hardhat");

async function main() {
    const [deployer, wallet1, wallet2] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Whitelisted wallets:");
    console.log("Wallet 1:", wallet1.address);
    console.log("Wallet 2:", wallet2.address);

    // Contract parameters
    const NAME = "CC3 Collections";
    const SYMBOL = "CC3C";
    const BASE_URI = "ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/";
    const COST = ethers.utils.parseEther("10"); // 10 ETH
    const MAX_SUPPLY_PER_TOKEN = 100;
    const ALLOW_MINTING_ON = Math.floor(Date.now() / 1000) + 120; // 2 mins from now

    // Deploy NFT1155
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    const nft = await NFT1155.deploy(
        NAME,
        SYMBOL,
        BASE_URI,
        COST,
        MAX_SUPPLY_PER_TOKEN,
        ALLOW_MINTING_ON
    );
    await nft.deployed();
    console.log("NFT1155 deployed to:", nft.address);

    // Owner functions
    console.log("\nExecuting owner functions...");

    // Enable presale
    console.log("Enabling presale...");
    await nft.setPresaleActive(true);

    // Add addresses to whitelist
    const whitelistAddresses = [
        wallet1.address,
        wallet2.address
    ];
    console.log("Adding addresses to whitelist...");
    await nft.setWhitelist(whitelistAddresses, true);

    // Update cost (optional)
    const newCost = ethers.utils.parseEther("5"); // 5 ETH
    console.log("Updating mint cost...");
    await nft.setCost(newCost);

    // Keep the same minting time that was set during deployment
    console.log("Minting time is set to 2 minutes from deployment");

    // Update base URI (optional)
    console.log("Updating base URI...");
    await nft.setBaseURI(BASE_URI);

    console.log("\nDeployment and setup complete!");
    console.log("Contract address:", nft.address);
    console.log("Current cost:", ethers.utils.formatEther(await nft.cost()), "ETH");
    const mintTime = await nft.allowMintingOn();
    console.log("Minting allowed from:", new Date(mintTime.toNumber() * 1000).toLocaleString());
    console.log("Minting allowed from timestamp:", mintTime.toNumber());
    console.log("Current time:", new Date().toLocaleString());
    console.log("Presale active:", await nft.presaleActive());

    // Save contract address to a file for later use
    const fs = require("fs");
    const contractData = {
        address: nft.address,
        network: hre.network.name,
        mintingTime: mintTime.toNumber()
    };
    fs.writeFileSync(
        "contract-address.json",
        JSON.stringify(contractData, null, 2)
    );
    console.log("\nContract address saved to contract-address.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
