const hdeploy = require('hardhat-deploy');
const dotenv = require('dotenv');
const waffle = require('@nomiclabs/hardhat-waffle');
const ethers = require('@nomiclabs/hardhat-ethers');

const chainIds = {
    goerli: 5,
    hardhat: 1337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
    bsctest: 97,
    bscmain: 56,
    cronosTest: 338,
};

dotenv.config();

const INFURA_TOKEN = process.env.INFURA_TOKEN;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.6.12",
                settings: {
                    metadata: {
                        bytecodeHash: "none",
                    },
                    optimizer: {
                        enabled: true,
                        runs: 1,
                    },
                },
            }
        ],
        settings: {
            outputSelection: {    
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
    },
    networks: {
        // hardhat node setup at 8448
        local: {
            url: 'http://127.0.0.1:8448/',
            allowUnlimitedContractSize: !1,
        },
        hardhat: {
            allowUnlimitedContractSize: !1,
        },
    },
    paths: {
        tests: "./test",
        cache: "./cache",
        sources: "./contracts",
        deploy: "./scripts",
        artifacts: "./artifacts",
        deployments: "./deployments",
    },
    mocha: {
        timeout: 60000,
    },
};

// import './scripts/tasks';

module.exports = config;

