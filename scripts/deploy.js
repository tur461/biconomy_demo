const { exec } = require("child_process");
const { run, ethers } = require("hardhat");
const { getSignParts, recover } = require('../utils/signature');

const TAG = {
  USDC: 'UChildAdministrableERC20_00',
}

const CONTRACTS = {
  USDC: 'UChildAdministrableERC20'
}

const DEPLOYER_PVT_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const main = async hre => {
    const { deployments, getNamedAccounts, getUnnamedAccounts } = hre;
    const { deploy } = deployments;
    const unnamedAccounts = await getUnnamedAccounts();
    
    const other = unnamedAccounts[1];
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
    await ct.initialize(
      'USDC',
      'USDC',
      18,
      deployer
    );
    await ct.mint(deployer, '127865');
    
    const name = (await ct.name());
    const chainId = (await ct.getChainId()).toNumber();
    const nonce = (await ct.nonces(deployer)).toNumber();

    console.log('name:',  name)
    console.log('nonce:',  nonce)
    console.log('chainId:',  chainId)
    console.log('supply:', await ct.totalSupply())
    console.log('\nBalances before transfer\n');
    console.log('Balance of other:', await ct.balanceOf(other))
    console.log('Balance of deployer:', await ct.balanceOf(deployer))
    // await ct.transfer(other, '99')
    
    const ABI = [ "function transfer(address to, uint amount)" ];
    const iface = new ethers.utils.Interface(ABI);
    // i am transferring some balance to other 
    const fSig = iface.encodeFunctionData("transfer", [ other, 99 ])
    
    const sig = getSignParts({
      fSig,
      name: name,
      nonce: nonce,
      from: deployer,
      chainId: chainId,
      vContract: ct.address,
      pvtKey: DEPLOYER_PVT_KEY,
    })
    
    // console.log('Signature:', sig);
    //recover(sig.signature, sig.typedData)
    
    // do transfer via meta tx 
    await ct.executeMetaTransaction(deployer, fSig, sig.r, sig.s, sig.v, { from: deployer })
    
    console.log('\nBalances after meta tx transfer\n');
    console.log('Balance of other:', await ct.balanceOf(other))
    console.log('Balance of deployer:', await ct.balanceOf(deployer))

  };

async function getContract(contractName, addr) {
  return await ethers.getContractAt(contractName, addr)
}

module.exports = main;
