
export interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    iconBg: string; // Tailwind class for background color
    isNative?: boolean;
}

export interface Chain {
    id: number;
    name: string;
    iconBg: string; // Tailwind class for background color
    tokens: Token[];
}

export const CHAINS: Chain[] = [
    {
        id: 1,
        name: 'Ethereum',
        iconBg: 'bg-[#627EEA]',
        tokens: [
            { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, iconBg: 'bg-[#627EEA]', isNative: true },
            { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, iconBg: 'bg-[#2775CA]' },
            { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, iconBg: 'bg-[#26A17B]' },
            { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, iconBg: 'bg-[#F7931A]' },
        ],
    },
    {
        id: 8453,
        name: 'Base',
        iconBg: 'bg-[#0052FF]',
        tokens: [
            { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, iconBg: 'bg-[#627EEA]', isNative: true },
            { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, iconBg: 'bg-[#2775CA]' },
        ],
    },
    {
        id: 42161,
        name: 'Arbitrum',
        iconBg: 'bg-[#28A0F0]',
        tokens: [
            { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, iconBg: 'bg-[#627EEA]', isNative: true },
            { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, iconBg: 'bg-[#2775CA]' },
        ],
    },
    {
        id: 10,
        name: 'Optimism',
        iconBg: 'bg-[#FF0420]',
        tokens: [
            { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, iconBg: 'bg-[#627EEA]', isNative: true },
            { symbol: 'USDC', name: 'USD Coin', address: '0x0b2C639c533813f4Aa9D7837CAf992c63414742f', decimals: 6, iconBg: 'bg-[#2775CA]' },
        ],
    },
];
