import { http, createConfig } from 'wagmi'
import { mainnet, base, arbitrum } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mainnet, base, arbitrum],
    connectors: [
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
    },
})
