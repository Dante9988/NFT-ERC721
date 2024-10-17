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
        require(msg.value >= cost * _mintAmount, 'Insufficient payment.');
        // create a non fungible token 
        uint supply = totalSupply();

        for(uint i = 1; i <= _mintAmount; i++) {
             _safeMint(msg.sender, supply + i);
        }


    }


}
