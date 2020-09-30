// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMooniFactory.sol";
import "./MooniswapConstants.sol";


contract MooniFactoryGovernance is IMooniFactory, Ownable, MooniswapConstants {
    event FeeUpdate(
        uint256 fee
    );

    event DecayPeriodUpdate(
        uint256 decayPeriod
    );

    event ReferralShareUpdate(
        uint256 referralShare
    );

    event GovernanceShareUpdate(
        uint256 referralShare
    );

    event GovernanceFeeReceiverUpdate(
        address governanceFeeReceiver
    );

    uint256 public override fee = 0;
    uint256 public override decayPeriod = 5 minutes;
    uint256 public override referralShare = 0.05e18;
    uint256 public override governanceShare = 0;
    address public override governanceFeeReceiver = address(0);


    function setFee(uint256 newFee) external onlyOwner {
        require(newFee <= _MAX_FEE, "Factory: fee is too high");
        fee = newFee;
        emit FeeUpdate(newFee);
    }

    function setDecayPeriod(uint256 newDecayPeriod) external onlyOwner {
        require(newDecayPeriod <= _MAX_DECAY_PERIOD, "Factory: decay period is too big");
        decayPeriod = newDecayPeriod;
        emit DecayPeriodUpdate(newDecayPeriod);
    }

    function setReferralShare(uint256 newReferralShare) external onlyOwner {
        require(newReferralShare <= _MAX_SHARE, "Factory: ref share is too big");
        referralShare = newReferralShare;
        emit ReferralShareUpdate(newReferralShare);
    }

    function setGovernanceShare(uint256 newGovernanceShare) external onlyOwner {
        require(newGovernanceShare <= _MAX_SHARE, "Factory: gov share is too big");
        governanceShare = newGovernanceShare;
        emit GovernanceShareUpdate(newGovernanceShare);
    }

    function setGovernanceFeeReceiver(address newGovernanceFeeReceiver) external onlyOwner {
        governanceFeeReceiver = newGovernanceFeeReceiver;
        emit GovernanceFeeReceiverUpdate(newGovernanceFeeReceiver);
    }
}