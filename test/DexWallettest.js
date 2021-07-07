const  Dex = artifacts.require("Dex")
const Link = artifacts.require("LINK")
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    it("should only be possible for owner to add tokens", async () => {
let dex = await Dex.deployed()
let link = await Link.deployed()
  
await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})

 await truffleAssert.passes(
    dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
)
await truffleAssert.reverts(
    dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[1]})
)
})
it("should handle deposit correctly", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()

      await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);
      await link.approve(Dex.address, 10000) 

      await dex.deposit(5000, web3.utils.fromUtf8("LINK"));

     let balance = await dex.balance(accounts[0], web3.utils.fromUtf8("LINK"));

      assert.equal(balance.toNumber(), 5000);
    
      
})

/*await deployer.deploy(Link);
 let DexWallet = await DexWallet.deployed()
 let Link = await Link.deployed()
 await Link.approve(DexWallet.address, 500)
DexWallet.addToken(web3.utils.fromUtf8("LINK"))
*/

})