const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('NFT', () => {
    let nft, deployer, minter
    const NAME = 'AI Punks'
    const SYMBOL = 'AIP'
    const COST = ether(10)
    const MAX_SUPPLY = 25
    const BASE_URI = 'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'

    beforeEach(async () => {

        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        minter = accounts[1]
    })

    describe('Deployment', () => {

        const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10) // 2 mins from now

        beforeEach(async () => {
            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
        })

        it('has correct name', async () => {
            expect(await nft.name()).to.eq(NAME)
        })

        it('has correct symbol', async () => {
            expect(await nft.symbol()).to.eq(SYMBOL)
        })

        it('returns the cost to mint', async () => {
            expect(await nft.cost()).to.eq(COST)
        })

        it('returns the max total supply', async () => {
            expect(await nft.maxSupply()).to.eq(MAX_SUPPLY)
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

        let transaction, result;

        describe('Success', async () => {

            const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // now

            beforeEach(async () => {
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                transaction = await nft.connect(minter).mint(1, {value: COST});
                result = await transaction.wait();
            })

            it('updates the total supply', async () => {
                expect(await nft.totalSupply()).to.eq(1);
            })

            it('updates the contract ether balance', async () => {
                expect(await ethers.provider.getBalance(nft.address)).to.eq(COST);
            })
        })

        describe('Failure', async () => {

            it('rejects insufficient funds', async () => {
                const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                await expect(nft.connect(minter).mint(1, {value: ether(1)})).to.be.revertedWith('Insufficient payment.');
            })

            it('require at least 1 NFT to be minted', async () => {
                const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                await expect(nft.connect(minter).mint(0, {value: COST})).to.be.revertedWith('At least 1 NFT required to mint.');
            })

            it('rejects minting more than max supply', async () => {
                const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                // We need to ensure correct ether amount sent: ether(10) per 1 NFT, meanwhile we want more than max supply
                await expect(nft.connect(minter).mint(26, {value: ether(260)})).to.be.revertedWith("Can't mint more than max supply.");
            })

            it('rejects minting more than 5 per function call', async () => {
                const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10) // now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                // We need to ensure correct ether amount sent: ether(10) per 1 NFT, meanwhile we want more than max supply
                await expect(nft.connect(minter).mint(6, {value: ether(60)})).to.be.revertedWith("Can't mint more than 5 NFTs per function call.");
            })

            it('rejects minting before allowed time', async () => {
                const ALLOW_MINTING_ON = new Date('Nov 01, 2077 18:00:00').getTime().toString().slice(0, 10) // now
                const NFT = await ethers.getContractFactory('NFT')
                nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

                await expect(nft.connect(deployer).mint(1, {value: COST})).to.be.revertedWith('Minting has not started.');
            })
        })

    })

})