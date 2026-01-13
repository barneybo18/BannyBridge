// Integrator Fee Configuration

// The address that will receive the integrator fees on the destination chain.
// Loaded from .env file (VITE_APP_FEE_RECIPIENT)
export const APP_FEE_RECIPIENT = import.meta.env.VITE_APP_FEE_RECIPIENT;

// The fee percentage to collect (e.g. 0.001 = 0.1%)
// Loaded from .env file (VITE_APP_FEE_PERCENTAGE)
export const APP_FEE_PERCENTAGE = Number(import.meta.env.VITE_APP_FEE_PERCENTAGE); 
