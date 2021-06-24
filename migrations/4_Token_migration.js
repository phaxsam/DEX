const Link = artifacts.require("Link");



module.exports =  function (deployer) {
   deployer.deploy(Link);
/* let DexWallet = await DexWallet.deployed()
 let Link = await Link.deployed()
 await Link.approve(DexWallet.address, 500)
DexWallet.addToken(web3.utils.fromUtf8("LINK"))
await DexWallet.deposit(100, web3.utils.fromUtf8("LINK"))
let balanceofLink = await DexWallet.balance(accounts[0], web3.utils.fromUtf8("LINK"))
console.log(balanceofLink);*/
};