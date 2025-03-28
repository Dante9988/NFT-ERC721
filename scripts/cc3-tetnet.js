const hre = require("hardhat");
const fs = require("fs");

async function main() {

    let transaction;
    // Contract address on cc3-testnet
    const CONTRACT_ADDRESS = "0x0ba61e75D598893105E0eEE21Fd328174688D2f5"; 

    const [deployer] = await ethers.getSigners();
    console.log("Managing contract with account:", deployer.address);

    // Get contract instance
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    const nft = NFT1155.attach(CONTRACT_ADDRESS);
    console.log("Connected to NFT1155 at:", nft.address);

    try {
        // Check current state
        const currentPresaleState = await nft.presaleActive();
        console.log("\nCurrent contract state:");
        console.log("Presale active:", currentPresaleState);

        // Add new addresses to whitelist
        const newWhitelistAddresses = [
            "0x...", 
            "0x..."
        ];
        
        // console.log("\nAdding addresses to whitelist...");
        // await nft.setWhitelist(newWhitelistAddresses, true);
        // console.log("Addresses added to whitelist:", newWhitelistAddresses);

        // Toggle presale state (uncomment the one you need)
        // Enable presale
        // await nft.setPresaleActive(true);
        // console.log("\nPresale has been enabled");

        // Disable presale
        transaction = await nft.setPresaleActive(false);
        await transaction.wait();
        console.log("Transaction hash:", transaction.hash);
        console.log("\nPresale has been disabled");

        // Verify whitelist status for addresses
        // console.log("\nVerifying whitelist status:");
        // for (const address of newWhitelistAddresses) {
        //     const isWhitelisted = await nft.presaleWhitelist(address);
        //     console.log(`Address ${address}: ${isWhitelisted ? 'Whitelisted' : 'Not whitelisted'}`);
        // }

        // Get updated presale state
        const newPresaleState = await nft.presaleActive();
        console.log("\nUpdated contract state:");
        console.log("Presale active:", newPresaleState);

    } catch (error) {
        console.error("\nError occurred:");
        console.error(error.message);
        if (error.error) {
            console.error("\nAdditional error details:");
            console.error(error.error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });