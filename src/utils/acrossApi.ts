
export interface DepositQuote {
    estimatedFillTimeSec: number;
    capitalFeePct: string;
    capitalFeeTotal: string;
    relayGasFeePct: string;
    relayGasFeeTotal: string;
    relayFeePct: string;
    relayFeeTotal: string;
    lpFeePct: string;
    lpFee?: { pct: string; total: string };
    timestamp: string;
    isAmountTooLow: boolean;
    quoteBlock: string;
    spokePoolAddress: string;
    exclusiveRelayer: string;
    exclusivityDeadline: number;
    fillDeadline: string;
    outputAmount: string; // The amount user will receive on destination chain
    totalRelayFee: { pct: string; total: string }; // Total fee breakdown
    relayerCapitalFee: { pct: string; total: string };
    relayerGasFee: { pct: string; total: string };
    destinationSpokePoolAddress: string;
    inputToken: { address: string; symbol: string; decimals: number; chainId: number };
    outputToken: { address: string; symbol: string; decimals: number; chainId: number };
    limits: {
        minDeposit: string;
        maxDeposit: string;
        maxDepositInstant: string;
        maxDepositShortDelay: string;
        recommendedDepositInstant: string;
    };
}

export async function getSuggestedFees(
    originChainId: number,
    destinationChainId: number,
    inputToken: string,
    outputToken: string,
    amount: string // raw amount
): Promise<DepositQuote> {
    const baseUrl = import.meta.env.VITE_ACROSS_API_URL || 'https://app.across.to/api';
    const url = `${baseUrl}/suggested-fees?inputToken=${inputToken}&outputToken=${outputToken}&originChainId=${originChainId}&destinationChainId=${destinationChainId}&amount=${amount}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    console.log("Across API Quote Response:", data);
    return data;
}
