// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {

    uint public cost;
    uint public maxSupply;
    uint public allowMintingOn;
    string public baseURI;
    
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
    }

    

}
