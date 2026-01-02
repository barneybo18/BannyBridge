import { createAcrossClient } from "@across-protocol/app-sdk";
import { mainnet, optimism, arbitrum, base, polygon, bsc, sepolia, arbitrumSepolia, baseSepolia } from "viem/chains";

// Initialize Across client with supported chains
// Note: BNB Smart Chain (BSC) uses chain ID 56
export const acrossClient = createAcrossClient({
    integratorId: "0xdead", // Placeholder - replace with actual integrator ID from Across team
    chains: [mainnet, optimism, arbitrum, base, polygon, bsc, sepolia, arbitrumSepolia, baseSepolia],
});
