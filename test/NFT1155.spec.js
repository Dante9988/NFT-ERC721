const { expect } = require('chai');
const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('NFT1155', () => {
    let nft, deployer, minter, unauthorized
    const NAME = "My NFT Collection"
    const SYMBOL = "MNFT"
    const COST = ether(10)
    const BASE_URI = 'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'
    const MAX_SUPPLY_PER_TOKEN = 100
    const ALLOW_MINTING_ON = Math.floor(Date.now() / 1000) // Now

    // Time windows (set relative to current time)
    const now = Math.floor(Date.now() / 1000)
    const EARLY_ACCESS_OPENS = now + 100
    const PURCHASE_OPENS = now + 200
    const PURCHASE_CLOSES = now + 300
    const BURN_OPENS = now + 400
    const BURN_CLOSES = now + 500

    // Merkle tree setup
    let merkleTree
    let merkleRoot
    let merkleProof

    beforeEach(async () => {
        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        minter = accounts[1]
        unauthorized = accounts[2]

        // Create merkle tree
        const leaves = [
            ethers.utils.solidityKeccak256(
                ['uint256', 'address', 'uint256'],
                [0, minter.address, 2]
            )
        ]
        merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        merkleRoot = merkleTree.getHexRoot()
        merkleProof = merkleTree.getHexProof(leaves[0])
    })

    describe('Deployment', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
        })

        it('returns the name', async () => {
            expect(await nft.name()).to.eq(NAME)
        })

        it('returns the symbol', async () => {
            expect(await nft.symbol()).to.eq(SYMBOL)
        })

        it('returns the cost to mint', async () => {
            expect(await nft.cost()).to.eq(COST)
        })

        it('returns the max supply per token', async () => {
            expect(await nft.maxSupplyPerToken()).to.eq(MAX_SUPPLY_PER_TOKEN)
        })

        it('returns the allowed minting time', async () => {
            expect(await nft.allowMintingOn()).to.eq(ALLOW_MINTING_ON)
        })

        it('returns the base URI', async () => {
            expect(await nft.baseURI()).to.eq(BASE_URI)
        })

        it('returns the owner', async () => {
            expect(await nft.owner()).to.eq(deployer.address)
        })
    })

    describe('Minting', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
        })

        it('allows minting', async () => {
            await nft.connect(minter).mint(minter.address, 1, "0x", { value: COST })
            expect(await nft.balanceOf(minter.address, 0)).to.eq(1)
        })

        it('enforces payment', async () => {
            await expect(
                nft.connect(minter).mint(minter.address, 1, "0x", { value: 0 })
            ).to.be.revertedWith("Insufficient payment")
        })

        it('enforces max supply per token', async () => {
            await expect(
                nft.connect(minter).mint(minter.address, MAX_SUPPLY_PER_TOKEN + 1, "0x", { value: COST.mul(MAX_SUPPLY_PER_TOKEN + 1) })
            ).to.be.revertedWith("Would exceed max supply per token")
        })

        it('tracks token supply', async () => {
            await nft.connect(minter).mint(minter.address, 5, "0x", { value: COST.mul(5) })
            expect(await nft.totalSupply(0)).to.eq(5)
        })

        it('tracks token creator', async () => {
            await nft.connect(minter).mint(minter.address, 1, "0x", { value: COST })
            expect(await nft.getCreator(0)).to.eq(minter.address)
        })
    })

    describe('Batch Minting', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
        })

        it('allows batch minting', async () => {
            const amounts = [2, 3, 1]
            const totalCost = COST.mul(amounts.reduce((a, b) => a + b))
            await nft.connect(minter).mintBatch(minter.address, amounts, "0x", { value: totalCost })
            
            expect(await nft.balanceOf(minter.address, 0)).to.eq(amounts[0])
            expect(await nft.balanceOf(minter.address, 1)).to.eq(amounts[1])
            expect(await nft.balanceOf(minter.address, 2)).to.eq(amounts[2])
        })
    })

    describe('Burning', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
            await nft.connect(minter).mint(minter.address, 5, "0x", { value: COST.mul(5) })
        })

        it('allows token owner to burn', async () => {
            await nft.connect(minter).burn(minter.address, 0, 2)
            expect(await nft.balanceOf(minter.address, 0)).to.eq(3)
            expect(await nft.totalSupply(0)).to.eq(3)
        })

        it('allows contract owner to burn', async () => {
            await nft.connect(deployer).burn(minter.address, 0, 2)
            expect(await nft.balanceOf(minter.address, 0)).to.eq(3)
        })

        it('prevents unauthorized burning', async () => {
            await expect(
                nft.connect(unauthorized).burn(minter.address, 0, 1)
            ).to.be.revertedWith("Not authorized")
        })
    })

    describe('URI Handling', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
            await nft.connect(minter).mint(minter.address, 1, "0x", { value: COST })
        })

        it('returns correct URI for existing token', async () => {
            expect(await nft.uri(0)).to.eq(`${BASE_URI}0.json`)
        })

        it('reverts for non-existent token', async () => {
            await expect(nft.uri(99)).to.be.revertedWith('URI query for nonexistent token')
        })
    })

    describe('Admin Functions', () => {
        beforeEach(async () => {
            const NFT1155 = await ethers.getContractFactory('NFT1155')
            nft = await NFT1155.deploy(
                NAME,
                SYMBOL,
                BASE_URI,
                COST,
                MAX_SUPPLY_PER_TOKEN,
                ALLOW_MINTING_ON
            )
        })

        it('allows owner to update cost', async () => {
            const newCost = ether(20)
            await nft.connect(deployer).setCost(newCost)
            expect(await nft.cost()).to.eq(newCost)
        })

        it('allows owner to update minting time', async () => {
            const newTime = ALLOW_MINTING_ON + 3600 // 1 hour later
            await nft.connect(deployer).setAllowMintingOn(newTime)
            expect(await nft.allowMintingOn()).to.eq(newTime)
        })

        it('allows owner to update presale status', async () => {
            await nft.connect(deployer).setPresaleActive(true)
            expect(await nft.presaleActive()).to.eq(true)
        })

        it('allows owner to update whitelist', async () => {
            await nft.connect(deployer).setWhitelist([minter.address], true)
            expect(await nft.presaleWhitelist(minter.address)).to.eq(true)
        })

        it('allows owner to withdraw', async () => {
            await nft.connect(minter).mint(minter.address, 1, "0x", { value: COST })
            const balanceBefore = await ethers.provider.getBalance(deployer.address)
            
            await nft.connect(deployer).withdraw()
            
            const balanceAfter = await ethers.provider.getBalance(deployer.address)
            expect(balanceAfter).to.be.gt(balanceBefore)
            expect(await ethers.provider.getBalance(nft.address)).to.eq(0)
        })
    })
})
