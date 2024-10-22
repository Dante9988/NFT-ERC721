// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint;

    string public baseExtension= ".json";
    uint public cost;
    uint public maxSupply;
    uint public allowMintingOn;
    string public baseURI;

    event Mint(uint amount, address minter);
    event Withdraw(uint amount, address owner);
    
    constructor(
        string memory _name, 
        string memory _symbol, 
        uint _cost, 
        uint _maxSupply,
        uint _allowMintingOn,
        string memory _baseURI) ERC721(_name, _symbol) 
    {
        cost = _cost;
        maxSupply = _maxSupply;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
    }

    function mint(uint _mintAmount) public payable {
        // Only allow minting after specified time
        require(block.timestamp >= allowMintingOn, 'Minting has not started.');
        require(msg.value >= cost * _mintAmount, 'Insufficient payment.');

        uint supply = totalSupply();
        require((supply + _mintAmount) <= maxSupply, "Can't mint more than max supply.");

        require(_mintAmount > 0, 'At least 1 NFT required to mint.');
        require(_mintAmount < 5, "Can't mint more than 5 NFTs per function call.");

        // create a non fungible token 
        for(uint i = 1; i <= _mintAmount; i++) {
             _safeMint(msg.sender, supply + i);
        }

        emit Mint(_mintAmount, msg.sender);
    }

    // return metadata IPFS url
    //  EG: 'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/1.json'
    function tokenURI(uint _tokenId) public view virtual override returns(string memory) {

        require(_exists(_tokenId), 'token does not exist');

        return(string(abi.encodePacked(baseURI, _tokenId.toString(), baseExtension)));
    }

    function walletOfOwner(address _owner) public view returns(uint[] memory) {
        require(msg.sender != address(0));
        uint ownerTokenCount = balanceOf(_owner);
        uint[] memory tokenIds = new uint[](ownerTokenCount);
        for(uint i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{ value: balance }("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint _newCost) public onlyOwner {
        cost = _newCost;
    }

    function pauseSale(uint _newTimeStamp) public onlyOwner {
        allowMintingOn = _newTimeStamp;
    }

    

}
