import { ethers } from "hardhat";
import { MyToken, MyToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const VOTE_VALUE = ethers.parseEther("1");
const ADDRESS_TO_MINT_TOKENS_TO = "0xF0A12CA4Bad158B07D809cBE0b3958F0e4829879";
const CONTRACT_ADDRESS = "0xC572b96f571FB5bfe6438C3981A4E4dF02c7ad43";
const VOTE_FOR = 2n

const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

const wallet = new ethers.Wallet (process.env.PRIVATE_KEY ?? "", provider);

async function main() {
    const contractFactory = new TokenizedBallot__factory(wallet);
    const contract = contractFactory.attach(CONTRACT_ADDRESS) as TokenizedBallot;
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);

    const voteTx = await contract.vote(VOTE_FOR, VOTE_VALUE);
    await voteTx.wait();

    const votingPowerSpent = await contract.votingPowerSpent(ADDRESS_TO_MINT_TOKENS_TO);
    console.log(`Account ${ADDRESS_TO_MINT_TOKENS_TO} spent ${votingPowerSpent.toString()} decimal units of voting power\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
