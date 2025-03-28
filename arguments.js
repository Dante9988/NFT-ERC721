module.exports = [
    "CC3 Collections", // NAME
    "CC3C", // SYMBOL
    "ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/", // BASE_URI
    ethers.utils.parseEther("10"), // COST - 10 ETH
    100, // MAX_SUPPLY_PER_TOKEN
    Math.floor(Date.now() / 1000) + 120 // ALLOW_MINTING_ON - 2 mins from now
]; 