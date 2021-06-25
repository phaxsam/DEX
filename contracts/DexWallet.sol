pragma solidity  ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "../node_modules/@openzeppelin/contracts/utils/math/Math.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
 
contract DexWallet is Ownable {
//using SafeMath for uint256;

 // the struct is used to get the full details of the coins 
   struct Token {
    bytes32 ticker;
    address tokenAddress;
     }
mapping(bytes32 => Token) public tokenMapping;
bytes32[] public tokenList;


// the double mapping is used to track the muliple addresses that are using the exchange
mapping(address => mapping(bytes32 => uint256)) public balance;


function addToken(bytes32 ticker, address tokenAddress) onlyOwner external {
    tokenMapping[ticker] = Token(ticker, tokenAddress);
    tokenList.push(ticker);
}

function deposit(uint amount,bytes32 ticker) external {

}

function withdraw(uint amount, bytes32 ticker) external {
    require(tokenMapping[ticker].tokenAddress != address(0));
    require(balance[msg.sender][ticker] >= amount, "Balance Exceeded");
    balance[msg.sender][ticker] = balance[msg.sender][ticker] - amount;
    IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
}
    
}