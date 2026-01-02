// Integrator Fee Configuration

// The address that will receive the integrator fees on the destination chain.
// Loaded from .env file (VITE_APP_FEE_RECIPIENT)
export const APP_FEE_RECIPIENT = import.meta.env.VITE_APP_FEE_RECIPIENT || "0x000000000000000000000000000000000000dead";

// The fee percentage to collect (e.g. 0.001 = 0.1%)
// Loaded from .env file (VITE_APP_FEE_PERCENTAGE)
export const APP_FEE_PERCENTAGE = Number(import.meta.env.VITE_APP_FEE_PERCENTAGE) || 0.001; 
