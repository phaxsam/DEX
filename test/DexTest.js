const  Dex = artifacts.require("Dex")
const Link = artifacts.require("LINK")
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    //the user must have eth  deposited such that deposited eth >= buy order value
    it("should throw an error if eth balance is too low when creating BUY limit order", async () => {
        let dex = await Dex.deployed()
    let link = await Link.deployed()
    await truffleAssert.reverts(
        dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
    )
     //await dex.depositEth({value: 10})
    await truffleAssert.passes(
        dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
    )
    })
    //the user must have enough tokens deposited such that token balance >= sell order amount
    it("should throw an error if token balance is too low when creating SELL limit order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
        dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1)
        )
    })
    //the BUY order book should be ordered on price from highest to lowest starting at index 0
    it("the BUY order book should be ordered from highest to lowest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 300)
         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 100)
         await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 200)
       
         let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
          assert(orderbook.length > 0);
         for (let i = 0; i < orderbook.length - 1; i++) {
          const element = array[index];
          truffleAssert(orderbook[i] >= orderbook[i+1])
      }
    })
    // the SELL order book should be ordered on price from lowest to highest starting at index 0
    it("the SELL oder bok should from lowest to highest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300)
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 100)
         await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 200)
        
         let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
         assert(orderbook.length > 0);
         for (let i = 0; i < orderbook.length - 1; i++) {
          const element = array[index];
          truffleAssert(orderbook[i] <= orderbook[i+1])
      }
    })
})