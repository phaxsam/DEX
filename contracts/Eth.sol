pragma solidity  ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ethereum is ERC20 {
constructor() ERC20("Ethereum", "ETH") public {
_mint(msg.sender,5000);
}

}