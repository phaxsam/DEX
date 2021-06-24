const Migrations = artifacts.require("Dex");
// const Dex = artifacts.require("Dex")
module.exports = function (deployer) {
  deployer.deploy(Migrations);
};