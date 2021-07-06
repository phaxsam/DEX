const  Dex = artifacts.require("Dex")
const Link = artifacts.require("LINK")
const Ethereum = artifacts.require("Ethereum")
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    //the user must have eth  deposited such that deposited eth >= buy order value
    it("should throw an error if eth balance is too low when creating BUY limit order", async () => {
        let dex = await Dex.deployed()
        let eth = await Ethereum.deployed()
         
        await dex.addToken(web3.utils.fromUtf8("ETH"), eth.address);
        await eth.approve(dex.address, 100000);
        await dex.deposit(6000, web3.utils.fromUtf8("ETH"));

         balance = await dex.balance(accounts[0], web3.utils.fromUtf8("ETH"));
         
         await truffleAssert.reverts(
            dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 7000, 2)
        )

        await truffleAssert.passes(
        dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 2000, 1)
    )
    })
    //the user must have enough tokens deposited such that token balance >= sell order amount
    it("should throw an error if token balance is too low when creating SELL limit order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);
        await link.approve(dex.address, 10000);
        await dex.deposit(1000, web3.utils.fromUtf8("LINK"));

         balance = await dex.balance(accounts[0], web3.utils.fromUtf8("LINK"));
      
         await truffleAssert.reverts(
            dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 2000, 2)
            )

        await truffleAssert.passes(
            dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 500, 1)
        )
    })
    //the BUY order book should be ordered on price from highest to lowest starting at index 0
    it("the BUY order book should be ordered from highest to lowest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let eth = await Ethereum.deployed()

        await dex.addToken(web3.utils.fromUtf8("ETH"), eth.address);
        await eth.approve(dex.address, 100000);
        await dex.deposit(6000, web3.utils.fromUtf8("ETH"));

        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);
        await link.approve(dex.address, 10000);
        await dex.deposit(1000, web3.utils.fromUtf8("LINK"));


         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 300)
         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 100)
         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 200)
       
         let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
          assert(orderbook.length > 0);
          console.log(orderbook);
         for (let i = 0; i < orderbook.length - 1; i++) {
         //  const element = array[index];
          truffleAssert(orderbook[i] >= orderbook[i+1])
      }
    })
    // the SELL order book should be ordered on price from lowest to highest starting at index 0
    it("the SELL oder bok should from lowest to highest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()


        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);
        await link.approve(dex.address, 10000);
        await dex.deposit(1000, web3.utils.fromUtf8("LINK"));

        await dex.addToken(web3.utils.fromUtf8("ETH"), eth.address);
        await eth.approve(dex.address, 100000);
        await dex.deposit(6000, web3.utils.fromUtf8("ETH"));

         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300)
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 100)
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 200)
        
         let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
         assert(orderbook.length > 0);

         for (let i = 0; i < orderbook.length - 1; i++) {
          assert(orderbook[i].price <= orderbook[i+1].price, "not rigth order in sell book")
      }
    })

})