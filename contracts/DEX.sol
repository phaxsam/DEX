//SPDX-License: MIT
pragma solidity  ^0.8.0;
pragma experimental ABIEncoderV2;
import "./DexWallet.sol";


contract Dex is DexWallet {

//using SafeMath for uint256;


enum Side{ BUY, SELL} 
//mapping(bytes32 => mapping(uint => order[]));
struct Order {
    uint id;
    address trader;
    Side side;
    bytes32 ticker;
    uint amount;
    uint price;
    uint filled;
}

uint public nextOrderId = 0;

mapping(bytes32 => mapping(uint => Order[])) public orderBook;

function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory) {
    return orderBook[ticker][uint(side)];
} 
function createLimitOrder( Side side, bytes32 ticker, uint amount, uint price) public {
if(side == Side.BUY) {
    require(balance[msg.sender]["ETH"] >= amount * price);
}
else if(side == Side.SELL) {
    require(balance[msg.sender]["ticker"] >= amount);
}
Order[] storage orders = orderBook[ticker][uint(side)];
 orders.push(Order(nextOrderId, msg.sender, side, ticker, amount, price));

    //Bubble sort
   uint i = orders.length > 0 ? orders.length -1 : 0;
   
    if(side == Side.BUY){
        while(i > 0){
     if(orders[i - 1].price > orders[i].price) {
         break;
     }
     Order memory orderToMove =orders[i - 1];
     orders[i -1] = orders[i];
     orders[i] = orderToMove;
     i--;
        }
    } 
    else if(side == Side.SELL){
         while(i > 0){
     if(orders[i - 1].price < orders[i].price) {
         break;
     }
     Order memory orderToMove =orders[i - 1];
     orders[i -1] = orders[i];
     orders[i] = orderToMove;
     i--;
        }
    }
     
     nextOrderId++;

}

function createMarketOrder( Side side, bytes32 ticker, uint amount) public {
   if(side == Side.SELL){
       require(balances[msg.sender][ticker] >= amount, "insufficient balance");
   }
  // require(balances[msg.sender[ticker] >= amount, "insufficient balance");
   
    uint orderBookSide;
    if(side == Side.BUY) {
        orderBookSide = 1;
    } 
    else{
        orderBookSide = 0;
    }
    Order[] storage orders = orderBook[ticker][orderBookSide];
        // cost storage  cost = orders[i] * price;
    uint totalfilled = 0;
    for (uint256 i = 0; i < orders.length && totalfilled < amount; i++){
        //how much we can fill from order [1]
        uint leftToFilled = amount - totalfilled;
         uint availableToFill = orders[i].amount - orders[i].filled;
         uint filled =0;
         if(availableToFill > leftToFilled) {
             filled = leftToFilled;
         }
         else{
             filled = availableToFill;
         }
              
            totalfilled = totalfilled + filled;
        //update totalfilled
         if(side = Side.BUY){
            require(balances[msg.sender]["ETH"] >= filled * orders[i].price);
            //transfer eth from buyer to seller
            balances[msg.sender][ticker] = balances[msg.sender][ticker] + filled;
             balances[msg.sender]["ETH"] = balances[msg.sender]["ETH"] - cost;
            // send tokens from seller to buy
            // send tokens from seller to buyer

            balances[orders[i].trader][ticker] = balances[orders[i].trader][ticker] - filled;
            balances[orders[i].trader]["ETH"] = balances[orders[i].trader]["ETH"] + cost;

         }
        //excute trade and shift balances between buyer and seller
          if(side = Side.SELL){
               balances[msg.sender][ticker] = balances[msg.sender][ticker] - filled;
             balances[msg.sender]["ETH"] = balances[msg.sender]["ETH"] + cost;
            // send tokens from seller to buy
            // send tokens from seller to buyer

            balances[orders[i].trader][ticker] = balances[orders[i].trader][ticker] + filled;
            balances[orders[i].trader]["ETH"] = balances[orders[i].trader]["ETH"] -  cost;

          }
        // verify that the buyer has enough eth to cover the trade
    }
  }
//loop through the orderbook and remove 100% orderfilled
     while( orders.length > 0 && orders[0].filled = orders[0].amount && orders.length  -1 > 0) {
    //remove the top element in the orders array by overwriting every element with the next element in the order list
    for (uint256 i = 0; i < orders.length; i++) {
        orders[i] = orders[i + 1];
    }
    orders.pop();
}
}