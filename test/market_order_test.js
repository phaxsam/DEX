const  Dex = artifacts.require("Dex")
const Link = artifacts.require("LINK")
const Ethereum = artifacts.require("Ethereum")
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => { 
 // when creating a SELL marketb order, the seller must have enough tokens for the trade
  it("should throw an error when creating a sell  market other without adequate toekn balance", async () => {

    let dex = await Dex.deployed()
    let link = await Link.deployed()

    await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);
    await link.approve(dex.address, 10000);

    let balance = await dex.balance(accounts[0], web3.utils.fromUtf8("LINK"));


    await dex.deposit(1000, web3.utils.fromUtf8("LINK"));


    

    assert.equal(balance.toNumber(), 0, "initail LINK balance is not 0");


    await truffleAssert.reverts(dex.createMarketOrder(1, web3.utils.fromUtf8("LINK"), 2000))

})

//when creating a BUY market order the buyer needs to have enough eth for the trade
// it("should throw an error when creating a BUY market order without adequate balance", async () => {
//     let dex = await Dex.deployed()
//     let eth = await Ethereum.deployed()
      
//     await dex.addToken(web3.utils.fromUtf8("ETH"), eth.address);
//     await eth.approve(dex.address, 10000);
//     let balance = await dex.balance(accounts[0], web3.utils.fromUtf8("ETH"))

//     await dex.deposit(1000, web3.utils.fromUtf8("ETH"));
      
    

//     assert.equal(balance.toNumber(), 0, "initial ETH balance is not 0");

//     await truffleAssert.reverts(dex.createMarketOrder(0, web3.utils.fromUtf8("ETH"), 2000))

// })

// //Market orders can be submitted  even if the order book is empty
// it("Market orders can be submitted  even if the order book is empty", async () => {

//     let dex = await Dex.deployed()
//         await dex.depositEth({value: 50000});

//         let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0); //get buy side orderbook

//         assert(orderbook.length == 0, "buy side orderbook length is not 0");

//         await truffleAssert.passes(dex.createMarketOrder(0,web3.utils.fromUtf8("LINK"), 10))
    
// })

//market order should be filled util the order book is emptied or the market order is 100% filled
it("market order should be filled util the order book is emptied or the market order is 100% filled", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()
    let eth = await Ethereum.deployed()
    await dex.addToken(web3.utils.fromUtf8("LINK"), link.address)
    await dex.addToken(web3.utils.fromUtf8("ETH"), eth.address)
    let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); //get sell side orderbook
    assert(orderbook.length == 0, "sell side orderbook should be empty at start of test");


    //send link token to accounts 1,2,3 from account o
    await link.transfer(accounts[1], 2000)
    await link.transfer(accounts[2], 2000)
    await link.transfer(accounts[3], 2000)

    await eth.transfer(accounts[1], 2000)
    await eth.transfer(accounts[2], 2000)
    await eth.transfer(accounts[3], 2000)
    //approve DEX for accounts 1,2,3  
    await link.approve(dex.address, 1500, {from: accounts[1]}); 
    await link.approve(dex.address, 1500, {from: accounts[2]});
    await link.approve(dex.address, 1500, {from: accounts[3]});

    await eth.approve(dex.address, 1500);
    await eth.approve(dex.address, 1500, {from: accounts[1]}); 
    await eth.approve(dex.address, 1500, {from: accounts[2]});
    await eth.approve(dex.address, 1500, {from: accounts[3]});



    //deposit link into DEX for accounts 1, 2, 3
    await dex.deposit(1000, web3.utils.fromUtf8("LINK"), {from: accounts[1]});
    await dex.deposit(1000, web3.utils.fromUtf8("LINK"), {from: accounts[2]});
    await dex.deposit(1000, web3.utils.fromUtf8("LINK"), {from: accounts[3]});

    await dex.deposit(1000, web3.utils.fromUtf8("ETH"));
    await dex.deposit(1000, web3.utils.fromUtf8("ETH"), {from: accounts[1]});
    await dex.deposit(1000, web3.utils.fromUtf8("ETH"), {from: accounts[2]});
    await dex.deposit(1000, web3.utils.fromUtf8("ETH"), {from: accounts[3]});

    //fill up the sell order
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 100, {from: accounts[1]})
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 100, {from: accounts[2]})
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 100, {from: accounts[3]})



    //create market order that should fill 2/3 orders in the book
    await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10);

    orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // get sell side orderbook
    console.log(orderbook);
    assert(orderbook.length == 1, "sell side orderbook should only have 1 order left");
    assert(orderbook[0].filled == 0, "sell side orderbook should have 0 filled");

})

// //market orders should be filled untill the order book is empty or the market is 100% filled
// it("market orders should be filled untill the order book is empty or the market is 100% filled", async () => {
//     let dex = await Dex.deployed()
//       let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // get sell side orderbook
//       assert(orderbook.length == 1, "sell side orderbook should have 1 order left");

//       //fill up the sell order again
//       await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 400, {from: accounts[1]})
//       await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 400, {from: accounts[2]})
       
//       //check buyer link balance before link purchase
//       let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"))

//       //create market order that could fill more than the entire order book(15 link)
//       await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 50);
       
//       //check  buyer link balance after purchase
//       let balanceAfter = await dex.balance(accounts[0], web3.utils.fromUtf8("LINK"))
     
//       //buyer should have 15 more link aafter, even though order was for 50
//       assert.equal(balance.toNumber() + 15, balance.toNumber());
// })

//    //the eth balance of the buyer should decrese with the filled amount
//    it("the ethh balance should decrease with the filled amount", async () => {
//        let dex = await Dex.deployed()
//        let link = await Link.deployed()
        
//        //seller depsoits link and creates  a sell limit order for 1 link for 300wei 
//        await link.approve(dex.address, 500, {from: accounts[1]});
//        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300, {from: accounts[1]})

//        //check buyer eth balance before trade
//        let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));
//        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 1);
//        let balanceAfter = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));
//        assert.equal(balanceBefore.toNumber() - 300, balanceAfter.toNumber());

//    })

  /* //the token balances of thr limit order sellers should decrease with the amount filled
    it("the token balances of the limit ordee sellers should decrease with the filled amount", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); //get sell side
        assert(orderbook.length == 0, "sell side orderbook should be empty at start of test");

        //seller accounts[2] deposits link
        await link.approve(dex.address, 500, {from: accounts[2]});
        await dex.deposit(100, web3.utils.fromUtf8("LINK"), {from: accounts[2]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300, {from: accounts[1]})
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 400, {from: accounts[2]})

        //check sellers link balance before trade
        let account1balanceBefore = await dex.balances(accounts[1], web3.utils.fromUtf8("LINK") );
        let account2balanceBefore = await dex.balances(accounts[2], web3.utils.fromUtf8("LINK") );

        //accounts[0] created market order to buy up both sell orders
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 2);

        //check sellers link balance after trade 
        let account1balanceAfter = await dex.balances(accounts[1], web3.utils.fromUtf8("LINK") );
        let account2balanceAfter = await dex.balances(accounts[2], web3.utils.fromUtf8("LINK") );

        assert.equal(account1balanceBefore.toNumber() - 1, account1balanceAfter.toNumber());
        assert.equal(account2balanceBefore.toNumber() - 1, account2balanceAfter.toNumber());
    })
     
    //filled limit order should be removed from the orderbook
    it("filled limit order shpuld be reomved from the orderbook", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed
        await dex.addToken(web3.utils.fromUtf8("LINK"));
        await dex.depositEth({value: 10000});
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); //get sell sode of the order book
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300)
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1);
         orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // get sell side orderbook
         assert(orderbook.length == 0, "Sell side oder should be empty after trade"); 
        
    })

    //partly filled limit orders should be modified to represent the filled orremaining amount
    it("limit orders filled property should be set correctly after a trade", async () => {
        let dex = await Dex.deployed()
        
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // get sell side orderbook
        assert(orderbook.length == 0, "sell side order book should e emptied at the start of test");

        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 300, {from: accounts[1]})
        await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 2);

        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); //get the sell side of the order book
        assert.equal(orderbook[0].filled, 2);
        assert.equal(orderbook[5].filled, 5);

    })

    // when creating  BUY market order the buyer needs to have enough ETH for the trade   
     it("should throw an error when creating a buy limit without adequate ETH balance", async () => {
         let dex = await Dex.deployed()
         let eth = await Ethereum.deployed()
           

         let balance = await dex.balances(accounts[4], web3.utils.fromUtf8("ETH"))

         assert.equal(balance.toNumber(), 0, "initial balance is not 0");
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 300, {from: accounts[1]})

         await truffleAssert.reverts(dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 5, {from: accounts[4]}))
     })



*/


})
