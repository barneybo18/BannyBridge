
export interface Token {
    symbol: string;
    name?: string;
    address: string;
    decimals: number;
    iconBg: string; // Tailwind class for background color
    isNative?: boolean;
    logoUrl?: string; // URL to token logo image
}

export interface Chain {
    id: number;
    name: string;
    iconBg: string; // Tailwind class for background color
    logoUrl: string; // URL to chain logo image
    blockExplorerUrl: string;
    tokens: Token[];
}

export const CHAINS: Chain[] = [
    {
        id: 1,
        name: 'Ethereum',
        iconBg: 'bg-blue-500',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        blockExplorerUrl: 'https://etherscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
            { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, isNative: false, iconBg: 'bg-orange-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
            { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, isNative: false, iconBg: 'bg-yellow-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png' },
        ],
    },
    {
        id: 10,
        name: 'Optimism',
        iconBg: 'bg-red-500',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
        blockExplorerUrl: 'https://optimistic.etherscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
            { symbol: 'WBTC', address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095', decimals: 8, isNative: false, iconBg: 'bg-orange-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
        ],
    },
    {
        id: 56,
        name: 'BNB Chain',
        iconBg: 'bg-yellow-500',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
        blockExplorerUrl: 'https://bscscan.com',
        tokens: [
            { symbol: 'BNB', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-yellow-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' },
            { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
            { symbol: 'WETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, isNative: false, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
        ],
    },
    {
        id: 137,
        name: 'Polygon',
        iconBg: 'bg-purple-500',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
        blockExplorerUrl: 'https://polygonscan.com',
        tokens: [
            { symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-purple-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png' },
            { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
            { symbol: 'WETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18, isNative: false, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'WBTC', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8, isNative: false, iconBg: 'bg-orange-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
        ],
    },
    {
        id: 8453,
        name: 'Base',
        iconBg: 'bg-blue-600',
        logoUrl: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
        blockExplorerUrl: 'https://basescan.org',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'DAI', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, isNative: false, iconBg: 'bg-yellow-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png' },
        ],
    },
    {
        id: 42161,
        name: 'Arbitrum',
        iconBg: 'bg-blue-400',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
        blockExplorerUrl: 'https://arbiscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
            { symbol: 'WBTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8, isNative: false, iconBg: 'bg-orange-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
            { symbol: 'DAI', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, isNative: false, iconBg: 'bg-yellow-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png' },
        ],
    },
    {
        id: 59144,
        name: 'Linea',
        iconBg: 'bg-black',
        logoUrl: 'https://linea.build/favicon.svg',
        blockExplorerUrl: 'https://lineascan.build',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
        ],
    },
    {
        id: 534352,
        name: 'Scroll',
        iconBg: 'bg-orange-400',
        logoUrl: 'https://scroll.io/logo.png',
        blockExplorerUrl: 'https://scrollscan.com',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
        ],
    },
    {
        id: 324,
        name: 'ZKsync Era',
        iconBg: 'bg-blue-600',
        logoUrl: 'https://avatars.githubusercontent.com/u/82072230?s=200&v=4',
        blockExplorerUrl: 'https://explorer.zksync.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDC', address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4', decimals: 6, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
            { symbol: 'USDT', address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C', decimals: 6, isNative: false, iconBg: 'bg-green-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
        ],
    },
    {
        id: 81457,
        name: 'Blast',
        iconBg: 'bg-yellow-400',
        logoUrl: 'https://avatars.githubusercontent.com/u/142751859?s=200&v=4',
        blockExplorerUrl: 'https://blastscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'USDB', address: '0x4300000000000000000000000000000000000003', decimals: 18, isNative: false, iconBg: 'bg-yellow-300', logoUrl: 'https://assets.coingecko.com/coins/images/35062/small/USDB_logo.png' },
        ],
    },
];

export const TESTNET_CHAINS: Chain[] = [
    {
        id: 11155111,
        name: 'Sepolia',
        iconBg: 'bg-indigo-500',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        blockExplorerUrl: 'https://sepolia.etherscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'WETH', address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', decimals: 18, isNative: false, iconBg: 'bg-indigo-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
        ],
    },
    {
        id: 421614,
        name: 'Arbitrum Sepolia',
        iconBg: 'bg-blue-400',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
        blockExplorerUrl: 'https://sepolia.arbiscan.io',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'WETH', address: '0x980b62da83eff3d4576c647993b0c1d7faf17c73', decimals: 18, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
        ],
    },
    {
        id: 84532,
        name: 'Base Sepolia',
        iconBg: 'bg-blue-600',
        logoUrl: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
        blockExplorerUrl: 'https://sepolia.basescan.org',
        tokens: [
            { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, iconBg: 'bg-blue-500', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
            { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, isNative: false, iconBg: 'bg-blue-400', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
        ],
    },
];
