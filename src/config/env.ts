// Environment configuration with type safety and defaults

export const config = {
    // API URLs
    acrossApiUrl: import.meta.env.VITE_ACROSS_API_URL || 'https://app.across.to/api',
    coinGeckoApiUrl: import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',

    // App Configuration
    appName: import.meta.env.VITE_APP_NAME || 'BannyBridge',
    defaultFromChainId: Number(import.meta.env.VITE_DEFAULT_FROM_CHAIN_ID) || 8453, // Base
    defaultToChainId: Number(import.meta.env.VITE_DEFAULT_TO_CHAIN_ID) || 42161, // Arbitrum
} as const;

// Type-safe environment variable access
export const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key];
    if (!value && !defaultValue) {
        console.warn(`Environment variable ${key} is not set and no default provided`);
    }
    return value || defaultValue || '';
};

// Validate required environment variables
export const validateEnv = () => {
    const warnings: string[] = [];

    if (!import.meta.env.VITE_ACROSS_API_URL) {
        warnings.push('VITE_ACROSS_API_URL not set, using default');
    }

    if (!import.meta.env.VITE_COINGECKO_API_URL) {
        warnings.push('VITE_COINGECKO_API_URL not set, using default');
    }

    if (warnings.length > 0) {
        console.info('Environment configuration warnings:', warnings);
    }

    return warnings.length === 0;
};
