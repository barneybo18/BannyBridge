
// Simple price cache to avoid excessive API calls
const priceCache: { [key: string]: { price: number; timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute

// Map token symbols to CoinGecko IDs
const TOKEN_ID_MAP: { [symbol: string]: string } = {
    'ETH': 'ethereum',
    'WETH': 'ethereum',
    'USDC': 'usd-coin',
    'USDT': 'tether',
    'DAI': 'dai',
};

export async function getTokenPrice(symbol: string): Promise<number> {
    const tokenId = TOKEN_ID_MAP[symbol.toUpperCase()];

    // Return 1 for stablecoins
    if (['USDC', 'USDT', 'DAI'].includes(symbol.toUpperCase())) {
        return 1;
    }

    if (!tokenId) {
        console.warn(`No CoinGecko ID found for ${symbol}, defaulting to $1`);
        return 1;
    }

    // Check cache
    const cached = priceCache[tokenId];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.price;
    }

    try {
        const baseUrl = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
        const response = await fetch(
            `${baseUrl}/simple/price?ids=${tokenId}&vs_currencies=usd`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch price');
        }

        const data = await response.json();
        const price = data[tokenId]?.usd || 1;

        // Update cache
        priceCache[tokenId] = { price, timestamp: Date.now() };

        return price;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        // Return cached price if available, otherwise default to 1
        return cached?.price || 1;
    }
}
