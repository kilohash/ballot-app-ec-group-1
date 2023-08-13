import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC721Token, MyERC20Token, TokenSale, ERC20 } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const RATIO = 10n;

describe("NFT Shop", async () => {
    let deployer: HardhatEthersSigner;
    let acc1: HardhatEthersSigner;
    let acc2: HardhatEthersSigner;
    let tokenSaleContract: TokenSale;
    let myTokenContract: MyERC20Token;
    let nftContract: MyERC721Token;

    async function deployContracts() {
        // Deploying an ERC721 Token contract
        const nftContractFactory = await ethers.getContractFactory("MyERC721Token");
        const nftContract_ = await nftContractFactory.deploy();
        await nftContract_.waitForDeployment();
        const nftContractAddress = await nftContract_.getAddress();
      
        // Deploying an ERC20 Token contract
        const myTokenContractFactory = await ethers.getContractFactory("MyERC20Token");
        const myTokenContract_ = await myTokenContractFactory.deploy();
        await myTokenContract_.waitForDeployment();
        const myTokenContractAddress = await myTokenContract_.getAddress();

        // Deploying the Token Sale contract
        const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
        const tokenSaleContract_ = await tokenSaleContractFactory.deploy(RATIO, 1n, myTokenContractAddress, nftContractAddress);
        await tokenSaleContract_.waitForDeployment();

        return { tokenSaleContract_, myTokenContract_, nftContract_ }    
    }

  beforeEach(async () => {
    [ deployer, acc1, acc2 ] = await ethers.getSigners();
    const { tokenSaleContract_, myTokenContract_, nftContract_ } = await loadFixture(deployContracts);
    tokenSaleContract = tokenSaleContract_;
    myTokenContract = myTokenContract_;
    nftContract = nftContract_;
  });

  describe("When the Shop contract is deployed", async () => {

    it("defines the ratio as provided in parameters", async () => {
        const ratio = await tokenSaleContract.ratio();
        expect(ratio).to.eq(RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const paymentTokenAddress = await tokenSaleContract.paymentToken();
      const tokenSaleContractFactory = await ethers.getContractFactory("ERC20");
      const paymentToken = tokenSaleContractFactory.attach(paymentTokenAddress) as ERC20;
      // let's call the balanceOf method and it should not revert
      await expect(paymentToken.balanceOf(deployer.address)).not.to.be.reverted;
      await expect(paymentToken.totalSupply()).not.to.be.reverted;
    });
  });

  describe("When a user buys an ERC20 from the Token contract", async () => {
    const TEST_ETH_VALUE = ethers.parseUnits("1");

    let ETH_BALANCE_BEFORE_TX: bigint;
    let ETH_BALANCE_AFTER_TX: bigint;
    let TOKEN_BALANCE_BEFORE_TX: bigint;
    let TOKEN_BALANCE_AFTER_TX: bigint;
    let TX_FEES: bigint;

    beforeEach(async () => {
      TOKEN_BALANCE_BEFORE_TX = await myTokenContract.balanceOf(acc1.address)
      const buyTokensTx = await tokenSaleContract.connect(acc1).buyTokens( { value: TEST_ETH_VALUE, } );
      const receipt = await buyTokensTx.wait();
      const gasPrice = receipt?.gasPrice ?? 0n;
      const gasUsed = receipt?.gasUsed ?? 0n;
      TX_FEES = gasUsed * gasPrice;
      ETH_BALANCE_AFTER_TX = await ethers.provider.getBalance(acc1.address);
      TOKEN_BALANCE_AFTER_TX = await myTokenContract.balanceOf(acc1.address)
    });

    it("charges the correct amount of ETH", async () => {
      const diff = ETH_BALANCE_AFTER_TX - ETH_BALANCE_BEFORE_TX;
      const expectedDiff = ETH_BALANCE_BEFORE_TX * RATIO;
      expect(diff).to.eq(expectedDiff);
    });

    it("gives the correct amount of tokens", async () => {
      const diff = TOKEN_BALANCE_AFTER_TX - TOKEN_BALANCE_BEFORE_TX;
      const expectedDiff = TOKEN_BALANCE_BEFORE_TX * RATIO;
      expect(diff).to.eq(expectedDiff);
    });
  });

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
