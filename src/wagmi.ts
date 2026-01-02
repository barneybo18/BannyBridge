import { http, createConfig } from 'wagmi'
import { mainnet, base, arbitrum, optimism, bsc, polygon, linea, scroll, zkSync } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Define Blast chain (not in wagmi/chains yet)
const blast = {
    id: 81457,
    name: 'Blast',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.blast.io'] },
        public: { http: ['https://rpc.blast.io'] },
    },
    blockExplorers: {
        default: { name: 'Blastscan', url: 'https://blastscan.io' },
    },
} as const

export const config = createConfig({
    chains: [mainnet, optimism, bsc, polygon, base, arbitrum, linea, scroll, zkSync, blast],
    connectors: [
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [optimism.id]: http(),
        [bsc.id]: http(),
        [polygon.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [linea.id]: http(),
        [scroll.id]: http(),
        [zkSync.id]: http(),
        [blast.id]: http(),
    },
})
