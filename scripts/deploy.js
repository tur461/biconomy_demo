const { exec } = require("child_process");
const { run, ethers } = require("hardhat");
const TAG = {
  USDC: 'UChildAdministrableERC20_00',
}
const CONTRACTS = {
  USDC: 'UChildAdministrableERC20'
}

const main = async hre => {
    const { deployments, getNamedAccounts, getUnnamedAccounts } = hre;
    const { deploy } = deployments;
    const unnamedAccounts = await getUnnamedAccounts();
    
    const deployer = unnamedAccounts[0];
    
    const usdc = await deploy(TAG.USDC, {
      contract: CONTRACTS.USDC,
      from: deployer,
      args: [],
      log: !0,
      skipIfAlreadyDeployed: !0,
    });
    console.log('deployed @: ', usdc.address);

    const ct = await getContract(CONTRACTS.USDC, usdc.address);
    console.log('[s] minting..');
    await ct.mint(deployer, '127865');
    console.log('[s] done..');
};

async function getContract(contractName, addr) {
  return await ethers.getContractAt(contractName, addr)
}

module.exports = main;
