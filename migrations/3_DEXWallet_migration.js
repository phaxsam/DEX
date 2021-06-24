const  DEXWallet = artifacts.require("DexWallet");

module.exports = function (deployer) {
  deployer.deploy(DEXWallet);
};