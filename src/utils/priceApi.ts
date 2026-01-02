
// Simple price cache to avoid excessive API calls
const priceCache: { [key: string]: { price: number; timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute

// Map token symbols to CoinGecko IDs
const TOKEN_ID_MAP: { [symbol: string]: string } = {
    // Native tokens
    'ETH': 'ethereum',
    'WETH': 'ethereum',
    'MATIC': 'polygon-ecosystem-token', // Polygon native token (upgraded from matic-network)
    'POL': 'polygon-ecosystem-token',   // Newer ticker
    'BNB': 'binancecoin',

    // Stablecoins
    'USDC': 'usd-coin',
    'USDT': 'tether',
    'DAI': 'dai',
    'USDB': 'usdb', // Blast USD

    // Wrapped tokens
    'WBTC': 'wrapped-bitcoin',
};

export async function getTokenPrice(symbol: string): Promise<number> {
    const tokenId = TOKEN_ID_MAP[symbol.toUpperCase()];

    // Return 1 for stablecoins
    if (['USDC', 'USDT', 'DAI', 'USDB'].includes(symbol.toUpperCase())) {
        console.log(`${symbol} is a stablecoin, returning $1`);
        return 1;
    }

    if (!tokenId) {
        console.warn(`No CoinGecko ID found for ${symbol}, defaulting to $1`);
        return 1;
    }

    // Check cache
    const cached = priceCache[tokenId];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`Using cached price for ${symbol}:`, cached.price);
        return cached.price;
    }

    try {
        const baseUrl = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
        const url = `${baseUrl}/simple/price?ids=${tokenId}&vs_currencies=usd`;
        console.log(`Fetching price for ${symbol} (${tokenId}) from CoinGecko`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch price');
        }

        const data = await response.json();
        const price = data[tokenId]?.usd || 1;
        console.log(`Fetched price for ${symbol}:`, price);

        // Update cache
        priceCache[tokenId] = { price, timestamp: Date.now() };

        return price;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        // Return cached price if available, otherwise default to 1
        return cached?.price || 1;
    }
}
