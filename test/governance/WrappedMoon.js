const { ether, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const MooniFactoryGovernance = artifacts.require('MooniFactoryGovernance');
const MoonToken = artifacts.require('MoonToken');
const WrappedMoon = artifacts.require('WrappedMoon');

contract('WrappedMoon', function ([_, wallet1, wallet2]) {
    beforeEach(async function () {
        this.moonToken = await MoonToken.new();
        this.mooniFactoryGovernance = await MooniFactoryGovernance.new();
        this.wrappedMoon = await WrappedMoon.new(this.moonToken.address, this.mooniFactoryGovernance.address);
        await this.mooniFactoryGovernance.transferOwnership(this.wrappedMoon.address);
        await this.moonToken.mint(ether('1'), _);
        await this.moonToken.approve(this.wrappedMoon.address, ether('1'));
        await this.wrappedMoon.stake(ether('1'));
    });

    describe('fee', async function () {
        it('should correctly vote for fee', async function () {
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
            await this.wrappedMoon.feeVote(ether('0.1'));
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal(ether('0.1'));
        });

        it('should reject big fee', async function () {
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
            await expectRevert(
                this.wrappedMoon.feeVote(ether('0.2')),
                'Fee vote is too high',
            );
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
        });

        it('should discard fee', async function () {
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
            await this.wrappedMoon.feeVote(ether('0.1'));
            await this.wrappedMoon.discardFeeVote();
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
        });

        it('should reset fee vote on transfer', async function () {
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
            await this.wrappedMoon.feeVote(ether('0.1'));
            await this.wrappedMoon.transfer(wallet1, ether('1'));
            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal('0');
        });
    });

    describe('decay period', async function () {
        it('should correctly vote for decay period', async function () {
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
            await this.wrappedMoon.decayPeriodVote('120');
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('120');
        });

        it('should reject big decay period', async function () {
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
            await expectRevert(
                this.wrappedMoon.decayPeriodVote('4000'),
                'Decay period vote is too high',
            );
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
        });

        it('should reject small decay period', async function () {
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
            await expectRevert(
                this.wrappedMoon.decayPeriodVote('10'),
                'Decay period vote is too low',
            );
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
        });

        it('should discard decay period', async function () {
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
            await this.wrappedMoon.decayPeriodVote('120');
            await this.wrappedMoon.discardDecayPeriodVote();
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
        });

        it('should reset decay period vote on transfer', async function () {
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
            await this.wrappedMoon.decayPeriodVote('120');
            await this.wrappedMoon.transfer(wallet1, ether('1'));
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('300');
        });
    });

    describe('referral share', async function () {
        it('should correctly vote for referral share', async function () {
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
            await this.wrappedMoon.referralShareVote(ether('0.1'));
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.1'));
        });

        it('should reject big referral share', async function () {
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
            await expectRevert(
                this.wrappedMoon.referralShareVote(ether('0.4')),
                'Referral share vote is too high',
            );
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
        });

        it('should reject small referral share', async function () {
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
            await expectRevert(
                this.wrappedMoon.referralShareVote('10000'),
                'Referral share vote is too low',
            );
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
        });

        it('should discard referral share', async function () {
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
            await this.wrappedMoon.referralShareVote(ether('0.2'));
            await this.wrappedMoon.discardReferralShareVote();
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
        });

        it('should reset referral share vote on transfer', async function () {
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
            await this.wrappedMoon.referralShareVote(ether('0.2'));
            await this.wrappedMoon.transfer(wallet1, ether('1'));
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.05'));
        });
    });

    describe('governance share', async function () {
        it('should correctly vote for governance share', async function () {
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
            await this.wrappedMoon.governanceShareVote(ether('0.1'));
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal(ether('0.1'));
        });

        it('should reject big governance share', async function () {
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
            await expectRevert(
                this.wrappedMoon.governanceShareVote(ether('0.4')),
                'Gov share vote is too high',
            );
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
        });

        it('should discard governance share', async function () {
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
            await this.wrappedMoon.governanceShareVote(ether('0.2'));
            await this.wrappedMoon.discardGovernanceShareVote();
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
        });

        it('should reset governance share vote on transfer', async function () {
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
            await this.wrappedMoon.governanceShareVote(ether('0.2'));
            await this.wrappedMoon.transfer(wallet1, ether('1'));
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal('0');
        });
    });

    describe('transfers', async function () {
        it.only('3 users', async function () {
            await this.moonToken.mint(ether('1'), wallet1);
            await this.moonToken.approve(this.wrappedMoon.address, ether('1'), { from: wallet1 });
            await this.wrappedMoon.stake(ether('1'), { from: wallet1 });
            await this.wrappedMoon.feeVote(ether('0.06'), { from: wallet1 });
            await this.wrappedMoon.decayPeriodVote('120', { from: wallet1 });
            await this.wrappedMoon.referralShareVote(ether('0.03'), { from: wallet1 });
            await this.wrappedMoon.governanceShareVote(ether('0.12'), { from: wallet1 });

            await this.moonToken.mint(ether('1'), wallet2);
            await this.moonToken.approve(this.wrappedMoon.address, ether('1'), { from: wallet2 });
            await this.wrappedMoon.stake(ether('1'), { from: wallet2 });
            await this.wrappedMoon.feeVote(ether('0.03'), { from: wallet2 });
            await this.wrappedMoon.decayPeriodVote('60', { from: wallet2 });
            await this.wrappedMoon.referralShareVote(ether('0.04'), { from: wallet2 });
            await this.wrappedMoon.governanceShareVote(ether('0.09'), { from: wallet2 });

            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal(ether('0.03'));
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('160');
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.04'));
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal(ether('0.07'));

            await this.wrappedMoon.feeVote(ether('0.09'));
            await this.wrappedMoon.decayPeriodVote('600');
            await this.wrappedMoon.referralShareVote(ether('0.23'));
            await this.wrappedMoon.governanceShareVote(ether('0.21'));

            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal(ether('0.06'));
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('260');
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal(ether('0.1'));
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal(ether('0.14'));

            await this.wrappedMoon.transfer(wallet1, ether('1'));

            expect(await this.mooniFactoryGovernance.fee()).to.be.bignumber.equal(ether('0.05'));
            expect(await this.mooniFactoryGovernance.decayPeriod()).to.be.bignumber.equal('100');
            expect(await this.mooniFactoryGovernance.referralShare()).to.be.bignumber.equal('33333333333333333');
            expect(await this.mooniFactoryGovernance.governanceShare()).to.be.bignumber.equal(ether('0.11'));
        });
    });
});
