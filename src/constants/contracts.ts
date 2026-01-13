
export const SPOKE_POOL_ADDRESSES: { [chainId: number]: `0x${string}` } = {
    1: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5', // Ethereum Mainnet (V3)
    10: '0x6f26Bf09B1C792e3228e5467807a900A503c0281', // Optimism (V3)
    56: '0x4e8E101924eDE233C13e2D8622DC8aED2872d505', // BNB Chain (V3) - BSC SpokePool
    137: '0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096', // Polygon (V3)
    8453: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64', // Base (V3)
    42161: '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A', // Arbitrum (V3)
    59144: '0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75', // Linea (V3)
    534352: '0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96', // Scroll (V3)
    324: '0xE0B015E54d54fc84a6cB9B666099c46adE9335FF', // ZKsync Era (V3)
    81457: '0x2D509190Ed0172ba588407D4c2df918F955Cc6E1', // Blast (V3)
    // Testnets
    11155111: '0x5ef6C01E11889d86803e0B23e3cB3F9E9d97B662', // Sepolia
    421614: '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A', // Arbitrum Sepolia
    84532: '0x82B564983aE7274c86695917BBf8C99ECb6F0F8F', // Base Sepolia
};

export const WETH_ADDRESSES: { [chainId: number]: string } = {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    10: '0x4200000000000000000000000000000000000006',
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    137: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    8453: '0x4200000000000000000000000000000000000006',
    42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    59144: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Fd1A8',
    534352: '0x5300000000000000000000000000000000000004',
    324: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    81457: '0x4300000000000000000000000000000000000004',
    // Testnets
    11155111: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // Sepolia WETH
    421614: '0x980b62da83eff3d4576c647993b0c1d7faf17c73', // Arbitrum Sepolia WETH
    84532: '0x4200000000000000000000000000000000000006', // Base Sepolia WETH
};

export const ERC20_ABI = [
    {
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export const SPOKE_POOL_ABI = [
    {
        inputs: [
            { name: 'depositor', type: 'address' },
            { name: 'recipient', type: 'address' },
            { name: 'inputToken', type: 'address' },
            { name: 'outputToken', type: 'address' },
            { name: 'inputAmount', type: 'uint256' },
            { name: 'outputAmount', type: 'uint256' },
            { name: 'destinationChainId', type: 'uint256' },
            { name: 'exclusiveRelayer', type: 'address' },
            { name: 'quoteTimestamp', type: 'uint32' },
            { name: 'fillDeadline', type: 'uint32' },
            { name: 'exclusivityDeadline', type: 'uint32' },
            { name: 'message', type: 'bytes' },
        ],
        name: 'depositV3',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
] as const;
