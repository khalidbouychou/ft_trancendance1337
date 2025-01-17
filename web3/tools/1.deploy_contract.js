const fs = require('fs');
var HelloWorld = artifacts.require('HelloWorld');

module.exports = function(deployer) {
	deployer.deploy(HelloWorld).then(async () => {
		let instance = await HelloWorld.deployed();
		let contractAddress = instance.address;
		fs.writeFileSync('./contractAddress.txt', contractAddress);
	}).catch(error => {
	});
};
