// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT1155 is ERC1155, Ownable {
    using Strings for uint256;

    // Basic token info
    string public name;
    string public symbol;
    
    uint256 private _nextTokenId;
    mapping(uint256 => uint256) public totalSupply;
    
    // Creator tracking
    mapping(uint256 => address) public creators;
    
    // URI related variables
    string public baseURI;
    string public baseExtension = ".json";
    
    // Minting control
    uint256 public cost;
    uint256 public maxSupplyPerToken;
    uint256 public allowMintingOn;
    bool public presaleActive;
    mapping(address => bool) public presaleWhitelist;
    
    // Events
    event Mint(uint256 indexed tokenId, address indexed creator, uint256 amount);
    event CostUpdated(uint256 newCost);
    event MintingTimeUpdated(uint256 newTime);
    event PresaleStatusUpdated(bool active);
    event WhitelistUpdated(address user, bool status);
    event Withdrawn(uint256 amount);
    event URIUpdated(string newBaseURI);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _cost,
        uint256 _maxSupplyPerToken,
        uint256 _allowMintingOn
    ) ERC1155(_baseURI) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
        baseURI = _baseURI;
        cost = _cost;
        maxSupplyPerToken = _maxSupplyPerToken;
        allowMintingOn = _allowMintingOn;
    }
    
    modifier canMint() {
        require(block.timestamp >= allowMintingOn, "Minting has not started");
        require(!presaleActive || presaleWhitelist[msg.sender], "Not whitelisted for presale");
        _;
    }

    function mint(address to, uint256 amount, bytes memory data) external payable canMint {
        require(msg.value >= cost * amount, "Insufficient payment");
        uint256 tokenId = _nextTokenId++;
        require(totalSupply[tokenId] + amount <= maxSupplyPerToken, "Would exceed max supply per token");
        
        _mint(to, tokenId, amount, data);
        totalSupply[tokenId] += amount;
        creators[tokenId] = msg.sender;
        
        emit Mint(tokenId, msg.sender, amount);
    }
    
    function mintBatch(address to, uint256[] memory amounts, bytes memory data) external payable canMint {
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value >= cost * totalAmount, "Insufficient payment");
        
        uint256[] memory tokenIds = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            tokenIds[i] = _nextTokenId++;
            require(amounts[i] <= maxSupplyPerToken, "Would exceed max supply per token");
            totalSupply[tokenIds[i]] = amounts[i];
            creators[tokenIds[i]] = msg.sender;
        }
        _mintBatch(to, tokenIds, amounts, data);
    }

    // URI handling
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(totalSupply[tokenId] > 0, "URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension));
    }
    
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit URIUpdated(newBaseURI);
    }

    // Creator functions
    function getCreator(uint256 tokenId) external view returns (address) {
        return creators[tokenId];
    }

    // Existing functions...
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

    // Management functions
    function setCost(uint256 _newCost) external onlyOwner {
        cost = _newCost;
        emit CostUpdated(_newCost);
    }
    
    function setAllowMintingOn(uint256 _newTime) external onlyOwner {
        allowMintingOn = _newTime;
        emit MintingTimeUpdated(_newTime);
    }
    
    function setPresaleActive(bool _active) external onlyOwner {
        presaleActive = _active;
        emit PresaleStatusUpdated(_active);
    }
    
    function setWhitelist(address[] calldata _users, bool _status) external onlyOwner {
        for(uint256 i = 0; i < _users.length; i++) {
            presaleWhitelist[_users[i]] = _status;
            emit WhitelistUpdated(_users[i], _status);
        }
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Transfer failed");
        emit Withdrawn(balance);
    }

    // Support for ERC165 interface
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

