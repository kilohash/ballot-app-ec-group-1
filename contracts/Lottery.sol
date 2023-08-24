// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./LotteryToken.sol";

// “After you finish learning, you start teaching.
// And teaching is more learning, than learning.”

contract Lottery is Ownable {
    /// @notice Flag indicating whether the lottery is open ofr bets or not
    // compiler will automatically create a getter function for public variables
    bool public betsOpen;
    uint256 public betsClosingTime;
    LotteryToken public lotteryToken;

    /// @notice Passes when the lottery is at closed state
    modifier whenBetsClosed() {
        require(!betsOpen, "Lottery is open");
        _;
    }

    /// @notice Passes when the lottery is at open state and the current block timestamp is lower than the lottery closing date
    modifier whenBetsOpen() {
        require(
            betsOpen && block.timestamp < betsClosingTime,
            "Lottery is closed"
        );
        _;
    }

    constructor() {
        lotteryToken = new LotteryToken("Name", "SYM");
    }

    function openBets(uint256 closingTime) external whenBetsClosed onlyOwner {
        require (
            closingTime > block.timestamp,
            "Closing time must be in the future"
        );

        betsClosingTime = closingTime;
        betsOpen = true;
        // Something like this is not possible
        // cronJob.schedule(closingTime -> {betsOpen = false})

    }
}
