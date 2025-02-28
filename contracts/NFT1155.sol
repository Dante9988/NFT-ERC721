// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT1155 is ERC1155, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => uint256) public totalSupply;
    
    constructor(string memory uri) ERC1155(uri) Ownable(msg.sender) {}
    
    function mint(address to, uint256 amount, bytes memory data) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId, amount, data);
        totalSupply[tokenId] += amount;
    }
    
    function mintBatch(address to, uint256[] memory amounts, bytes memory data) external onlyOwner {
        uint256[] memory tokenIds = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            tokenIds[i] = _nextTokenId++;
            totalSupply[tokenIds[i]] = amounts[i];
        }
        _mintBatch(to, tokenIds, amounts, data);
    }
    
    function burn(address account, uint256 tokenId, uint256 amount) external {
        require(msg.sender == account || msg.sender == owner(), "Not authorized");
        _burn(account, tokenId, amount);
        totalSupply[tokenId] -= amount;
    }
    
    function burnBatch(address account, uint256[] memory tokenIds, uint256[] memory amounts) external {
        require(msg.sender == account || msg.sender == owner(), "Not authorized");
        _burnBatch(account, tokenIds, amounts);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            totalSupply[tokenIds[i]] -= amounts[i];
        }
    }
}
