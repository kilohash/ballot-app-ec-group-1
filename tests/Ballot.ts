import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Prop 1", "Prop 2", "Prop 3"]

describe("Ballot", () => {
  let owner: any, recipient: any, ballotContract: Ballot;
  async function deployContract() {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy((PROPOSALS.map(proposal => ethers.encodeBytes32String(proposal))));
    await ballotContract.waitForDeployment();
    return ballotContract;
  }

  describe("when the contract is deployed", async () => {
    beforeEach(async function () {
      const [ownerAccount, recipientAccount] = await ethers.getSigners();
      owner = ownerAccount;
      recipient = recipientAccount;
      ballotContract = await loadFixture(deployContract);
    });

    it("has the provided proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposal = await ballotContract.proposals(i);
        expect(ethers.decodeBytes32String(proposal.name)).to.eq(PROPOSALS[i]);
      }
    });
    it("zero votes for all proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposal = await ballotContract.proposals(i);
        expect(proposal.voteCount).to.eq(0);
      }
    });
    it("sets the deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.equal(owner.address);
    });
    it("sets the voting weight for the chairperson as 1", async () => {
      const chairperson = await ballotContract.voters(owner.address);
      expect(chairperson.weight).to.eq(1);
    });
    it("can vote", async () => {
      await ballotContract.vote(PROPOSALS.indexOf(PROPOSALS[1]));
      expect((await ballotContract.proposals(1)).voteCount).to.eq(1);
    }
    )
  });
    it("sets the voting weight for the chairperson as 1", async () => {
      const chairperson = await ballotContract.voters(owner.address);
      expect(chairperson.weight).to.eq(1);
    });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    beforeEach(async function () {
      const [ownerAccount, recipientAccount] = await ethers.getSigners();
      owner = ownerAccount;
      recipient = recipientAccount;
      ballotContract = await loadFixture(deployContract);
    });

    it("gives right to vote for another address", async () => {
      const voter = "0x5836e20e8720aF26E04a5Bd31E46726533b4fa51"
      await ballotContract.giveRightToVote(voter);

      const voterWeight = (await ballotContract.voters(voter)).weight;
      expect(voterWeight).to.eq(1);
    });
    it("can not give right to vote for someone that has voted", async () => {

      // throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {

      // throw Error("Not implemented");

    });
  });
});
