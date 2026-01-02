import { http, createConfig } from 'wagmi'
import { mainnet, base, arbitrum, optimism, bsc, polygon, linea, scroll, zkSync, blast } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

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
