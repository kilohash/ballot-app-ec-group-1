import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const ADDRESS_TO_MINT_TOKENS_TO = "0xF0A12CA4Bad158B07D809cBE0b3958F0e4829879";
const CONTRACT_ADDRESS = "0x83555B198FB77d64B296d5963203B4a160C241bc";

const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

const wallet = new ethers.Wallet (process.env.PRIVATE_KEY ?? "", provider);

async function main() {
    const contractFactory = new MyToken__factory(wallet);
    const contract = contractFactory.attach(CONTRACT_ADDRESS) as MyToken;
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);

    const balanceBN = await contract.balanceOf(ADDRESS_TO_MINT_TOKENS_TO);
    console.log(`Account ${ADDRESS_TO_MINT_TOKENS_TO} has ${balanceBN.toString()} decimal units of MyToken\n`)
    
    const delegateTx = await contract.connect(wallet).delegate(ADDRESS_TO_MINT_TOKENS_TO);
    await delegateTx.wait();

    const votesAfter = await contract.getVotes(ADDRESS_TO_MINT_TOKENS_TO);
    console.log(`Account ${ADDRESS_TO_MINT_TOKENS_TO} has ${votesAfter.toString()} units of voting power after self delegating\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
