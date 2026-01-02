import { createAcrossClient } from "@across-protocol/app-sdk";
import {
    mainnet, optimism, arbitrum, base, polygon, bsc,
    linea, scroll, zkSync, blast,
    sepolia, arbitrumSepolia, baseSepolia
} from "viem/chains";

const productionChains = [mainnet, optimism, arbitrum, base, polygon, bsc, linea, scroll, zkSync, blast];
const testnetChains = [sepolia, arbitrumSepolia, baseSepolia];

// Include testnets only in development or if explicitly enabled
const supportedChains = import.meta.env.DEV
    ? [...productionChains, ...testnetChains]
    : productionChains;

// Initialize Across client with supported chains
export const acrossClient = createAcrossClient({
    integratorId: "0xdead", // Placeholder - replace with actual integrator ID from Across team
    chains: supportedChains,
});
