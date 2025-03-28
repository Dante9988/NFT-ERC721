const hre = require("hardhat");
const fs = require("fs");

async function main() {
    // Load the deployed contract address
    if (!fs.existsSync("contract-address.json")) {
        console.error("contract-address.json not found. Please deploy the contract first.");
        return;
    }
    const contractData = JSON.parse(fs.readFileSync("contract-address.json"));
    
    if (contractData.network !== hre.network.name) {
        console.error(`Contract was deployed on ${contractData.network}, but current network is ${hre.network.name}`);
        return;
    }

    const [deployer, wallet1, wallet2] = await ethers.getSigners();
    console.log("Interaction wallets:");
    console.log("Wallet 1:", wallet1.address);
    console.log("Wallet 2:", wallet2.address);

    // Get contract instance
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    const nft = NFT1155.attach(contractData.address);
    console.log("Using NFT1155 at:", nft.address);

    // Get current contract state
    const cost = await nft.cost();
    console.log("\nCurrent contract state:");
    console.log("Cost per token:", ethers.utils.formatEther(cost), "ETH");
    console.log("Presale active:", await nft.presaleActive());

    try {
        // 1. Mint tokens with Wallet 1
        console.log("\n1. Minting tokens with Wallet 1...");
        await nft.connect(wallet1).mint(wallet1.address, 5, "0x", { value: cost.mul(5) });
        console.log("Minted 5 tokens of ID 0");
        console.log("Wallet 1 balance of token 0:", (await nft.balanceOf(wallet1.address, 0)).toString());

        // 2. Batch mint with Wallet 2
        console.log("\n2. Batch minting with Wallet 2...");
        const amounts = [2, 3, 1]; // Different amounts for tokens 1, 2, and 3
        const totalCost = cost.mul(amounts.reduce((a, b) => a + b));
        await nft.connect(wallet2).mintBatch(wallet2.address, amounts, "0x", { value: totalCost });
        console.log("Batch minted tokens with amounts:", amounts);
        for (let i = 0; i < amounts.length; i++) {
            console.log(`Wallet 2 balance of token ${i + 1}: ${(await nft.balanceOf(wallet2.address, i + 1)).toString()}`);
        }

        // 3. Transfer tokens from Wallet 1 to Wallet 2
        console.log("\n3. Transferring tokens from Wallet 1 to Wallet 2...");
        await nft.connect(wallet1).safeTransferFrom(
            wallet1.address,
            wallet2.address,
            0, // token ID 0
            2, // amount to transfer
            "0x"
        );
        console.log("Transferred 2 tokens of ID 0 to Wallet 2");
        console.log("Wallet 1 balance of token 0:", (await nft.balanceOf(wallet1.address, 0)).toString());
        console.log("Wallet 2 balance of token 0:", (await nft.balanceOf(wallet2.address, 0)).toString());

        // 4. Burn tokens with Wallet 2
        console.log("\n4. Burning tokens with Wallet 2...");
        await nft.connect(wallet2).burn(wallet2.address, 0, 1);
        console.log("Burned 1 token of ID 0 from Wallet 2");
        console.log("Wallet 2 balance of token 0:", (await nft.balanceOf(wallet2.address, 0)).toString());

        // 5. Batch transfer from Wallet 2 to Wallet 1
        console.log("\n5. Batch transferring tokens from Wallet 2 to Wallet 1...");
        const transferIds = [1, 2];
        const transferAmounts = [1, 2];
        await nft.connect(wallet2).safeBatchTransferFrom(
            wallet2.address,
            wallet1.address,
            transferIds,
            transferAmounts,
            "0x"
        );
        console.log("Batch transferred tokens to Wallet 1");
        for (let i = 0; i < transferIds.length; i++) {
            console.log(`Wallet 1 balance of token ${transferIds[i]}: ${(await nft.balanceOf(wallet1.address, transferIds[i])).toString()}`);
            console.log(`Wallet 2 balance of token ${transferIds[i]}: ${(await nft.balanceOf(wallet2.address, transferIds[i])).toString()}`);
        }

        // 6. Mint more tokens with Wallet 1
        console.log("\n6. Minting more tokens with Wallet 1...");
        await nft.connect(wallet1).mint(wallet1.address, 3, "0x", { value: cost.mul(3) });
        console.log("Minted 3 more tokens of ID 0");
        console.log("Wallet 1 final balance of token 0:", (await nft.balanceOf(wallet1.address, 0)).toString());

        // Final balances
        console.log("\n=== Final Token Balances ===");
        console.log("Token 0 total supply:", (await nft.totalSupply(0)).toString());
        console.log("Wallet 1 balances:");
        console.log("- Token 0:", (await nft.balanceOf(wallet1.address, 0)).toString());
        console.log("- Token 1:", (await nft.balanceOf(wallet1.address, 1)).toString());
        console.log("- Token 2:", (await nft.balanceOf(wallet1.address, 2)).toString());
        console.log("Wallet 2 balances:");
        console.log("- Token 0:", (await nft.balanceOf(wallet2.address, 0)).toString());
        console.log("- Token 1:", (await nft.balanceOf(wallet2.address, 1)).toString());
        console.log("- Token 2:", (await nft.balanceOf(wallet2.address, 2)).toString());

    } catch (error) {
        console.error("\nError during interaction:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 