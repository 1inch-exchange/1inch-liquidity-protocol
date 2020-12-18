const MooniswapFactory = artifacts.require('./MooniswapFactory.sol');

const FACTORY = {
    mainnet: '',
    'mainnet-fork': '',
}

const TOKEN = {
    kovan: '0x9F6A694123e5599a07f984eb8c0F3A475F553A03',
    'kovan-fork': '0x9F6A694123e5599a07f984eb8c0F3A475F553A03',
    mainnet: '0x28ed0b47EeE1F467D182620a333Fe69415Ba9AC9',
    'mainnet-fork': '0x28ed0b47EeE1F467D182620a333Fe69415Ba9AC9',
};

const POOLS = {
    mainnet: {
        'ETH-DAI': ['0x0000000000000000000000000000000000000000', '0x6B175474E89094C44Da98b954EedeAC495271d0F'],
        'ETH-USDC': ['0x0000000000000000000000000000000000000000', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
        'ETH-USDT': ['0x0000000000000000000000000000000000000000', '0xdAC17F958D2ee523a2206206994597C13D831ec7'],
        'ETH-WBTC': ['0x0000000000000000000000000000000000000000', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
        'ETH-1INCH': ['0x0000000000000000000000000000000000000000', TOKEN['mainnet']],
        'DAI-1INCH': ['0x6B175474E89094C44Da98b954EedeAC495271d0F', TOKEN['mainnet']],
    },
    'mainnet-fork': {
        'ETH-DAI': ['0x0000000000000000000000000000000000000000', '0x6B175474E89094C44Da98b954EedeAC495271d0F'],
        'ETH-USDC': ['0x0000000000000000000000000000000000000000', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
        'ETH-USDT': ['0x0000000000000000000000000000000000000000', '0xdAC17F958D2ee523a2206206994597C13D831ec7'],
        'ETH-WBTC': ['0x0000000000000000000000000000000000000000', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
        'ETH-1INCH': ['0x0000000000000000000000000000000000000000', TOKEN['mainnet-fork']],
        'DAI-1INCH': ['0x6B175474E89094C44Da98b954EedeAC495271d0F', TOKEN['mainnet-fork']],
    },
};

module.exports = function (deployer, network) {
    return deployer.then(async () => {
        if (network === 'test' || network === 'coverage') {
            // migrations are not required for testing
            return;
        }

        const factory = await MooniswapFactory.at(FACTORY[network]);

        for (const [_, [token0, token1]] of Object.entries(POOLS[network])) {
            factory.deploy(token0, token1);
        }
    });
};
