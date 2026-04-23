require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv');
dotenv.config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // localhost: {
    //   url: "http://localhost:8545",
    // },
    mainnet: {
      url: "https://mainnet.infura.io/v3/a25db8ba364f4d44adbb2721a7e04de0",
      accounts: [
        `0x${process.env.PRIVATE_KEY}`,
      ],
    }
  }
}
