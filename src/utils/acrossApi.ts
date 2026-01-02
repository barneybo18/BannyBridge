import { acrossClient } from "../lib/acrossClient";
import { APP_FEE_PERCENTAGE, APP_FEE_RECIPIENT } from "../constants/integrator";

export interface QuoteResult {
    deposit: {
        inputAmount: bigint;
        outputAmount: bigint;
        destinationChainId: number;
        originChainId: number;
        inputToken: string;
        outputToken: string;
        quoteTimestamp: number;
        fillDeadline: number;
        exclusivityDeadline: number;
        spokePoolAddress: string;
        destinationSpokePoolAddress: string;
        recipient: string | null;
        exclusiveRelayer: string;
        message: string;
    };
    estimatedFillTimeSec: number;
    fees: {
        totalRelayFee: {
            pct: bigint;
            total: bigint;
        };
        relayerGasFee: {
            pct: bigint;
            total: bigint;
        };
        relayerCapitalFee: {
            pct: bigint;
            total: bigint;
        };
        lpFee?: {
            pct: bigint;
            total: bigint;
        };
    };
    limits: {
        minDeposit: bigint;
        maxDeposit: bigint;
        maxDepositInstant: bigint;
        maxDepositShortDelay?: bigint;
        recommendedDepositInstant?: bigint;
    };
}

export async function getQuote(
    originChainId: number,
    destinationChainId: number,
    inputToken: string,
    outputToken: string,
    inputAmount: bigint
): Promise<QuoteResult> {
    try {
        console.log("=== FETCHING QUOTE WITH SDK ===");
        console.log("Origin Chain ID:", originChainId, "Type:", typeof originChainId);
        console.log("Destination Chain ID:", destinationChainId, "Type:", typeof destinationChainId);
        console.log("Input Token:", inputToken);
        console.log("Output Token:", outputToken);
        console.log("Input Amount:", inputAmount.toString(), "Type:", typeof inputAmount);

        const quoteParams = {
            route: {
                originChainId,
                destinationChainId,
                inputToken: inputToken as `0x${string}`,
                outputToken: outputToken as `0x${string}`,
            },
            inputAmount,
            appFee: APP_FEE_PERCENTAGE,
            appFeeRecipient: APP_FEE_RECIPIENT,
        };

        console.log("Quote params object:", JSON.stringify(quoteParams, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        const quote = await acrossClient.getQuote(quoteParams);

        console.log("=== SDK QUOTE RECEIVED ===");
        console.log("Output Amount:", quote.deposit.outputAmount.toString());
        console.log("Estimated Fill Time:", quote.estimatedFillTimeSec, "seconds");
        console.log("Total Relay Fee:", quote.fees.totalRelayFee.total);
        console.log("Fees Object:", JSON.stringify(quote.fees, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return quote;
    } catch (error) {
        console.error("Error fetching quote from SDK:", error);

        // Parse error message for user-friendly display
        let errorMessage = "Failed to fetch quote";

        if (error instanceof Error) {
            const message = error.message;

            if (message.toLowerCase().includes('route') ||
                message.toLowerCase().includes('not supported') ||
                message.toLowerCase().includes('unsupported')) {
                errorMessage = "This token pair is not supported. Try a different token combination.";
            } else if (message.toLowerCase().includes('amount') &&
                (message.toLowerCase().includes('low') || message.toLowerCase().includes('minimum'))) {
                errorMessage = "Amount is below the minimum required for this route.";
            } else if (message.toLowerCase().includes('token') && message.toLowerCase().includes('invalid')) {
                errorMessage = "One or more tokens are not supported on this chain.";
            } else {
                errorMessage = message;
            }
        }

        throw new Error(errorMessage);
    }
}
// Route checking
export interface Route {
    originChainId: number;
    originToken: string;
    destinationChainId: number;
    destinationToken: string;
}

let cachedRoutes: Route[] | null = null;

export async function getAvailableRoutes(isTestnet: boolean): Promise<Route[]> {
    // Use cache if available and matching environment (simplification: assume invalidation on reload or check length/basic prop)
    // For now, simple in-memory cache
    if (cachedRoutes) return cachedRoutes;

    try {
        const baseUrl = isTestnet ? 'https://testnet.across.to/api' : 'https://app.across.to/api';
        const response = await fetch(`${baseUrl}/available-routes`);
        if (!response.ok) throw new Error('Failed to fetch routes');

        const routes = await response.json();
        cachedRoutes = routes;
        return routes;
    } catch (error) {
        console.error("Error fetching available routes:", error);
        return [];
    }
}
