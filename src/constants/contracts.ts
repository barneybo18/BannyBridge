
export const SPOKE_POOL_ADDRESSES: { [chainId: number]: `0x${string}` } = {
    1: '0x5c7BCd6E7De5423a257D81B442095A15df84f3bb', // Ethereum Mainnet (V3)
    10: '0x6f26Bf09B1C792e3228e5467807a900A503c0281', // Optimism (V3)
    42161: '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A', // Arbitrum (V3)
    8453: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64', // Base (V3)
};

export const WETH_ADDRESSES: { [chainId: number]: string } = {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    10: '0x4200000000000000000000000000000000000006',
    42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    8453: '0x4200000000000000000000000000000000000006',
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
