
import { useState, useEffect } from 'react';
import { ArrowDown, Wallet, ShieldCheck, X, ChevronDown } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import TokenSelector from './TokenSelector';
import { CHAINS } from '../constants/chains';
import type { Chain, Token } from '../constants/chains';
import { ERC20_ABI, SPOKE_POOL_ABI, SPOKE_POOL_ADDRESSES, WETH_ADDRESSES } from '../constants/contracts';
import { getSuggestedFees } from '../utils/acrossApi';
import type { DepositQuote } from '../utils/acrossApi';

const BridgeWidget = () => {
    // Input state
    const [fromAmount, setFromAmount] = useState('');

    // Recipient state
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isEditingRecipient, setIsEditingRecipient] = useState(false);

    // Default selections
    const [fromChain, setFromChain] = useState<Chain>(CHAINS[1]); // Base
    const [fromToken, setFromToken] = useState<Token>(CHAINS[1].tokens[1]); // USDC

    const [toChain, setToChain] = useState<Chain>(CHAINS[2]); // Arbitrum
    const [toToken, setToToken] = useState<Token>(CHAINS[2].tokens[1]); // USDC

    // Selector state
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [selectorType, setSelectorType] = useState<'from' | 'to'>('from');

    // Wallet state
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    // Balance fetching (Native)
    const { data: nativeBalance } = useBalance({
        address,
        chainId: fromChain.id,
        query: {
            enabled: !!address && fromToken.isNative
        }
    });

    // Balance fetching (ERC20)
    const { data: tokenBalance } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        chainId: fromChain.id,
        query: {
            enabled: !!address && !fromToken.isNative
        }
    });

    const balanceValue = fromToken.isNative ? nativeBalance?.value : tokenBalance;
    const balanceFormatted = balanceValue !== undefined
        ? formatUnits(balanceValue, fromToken.decimals)
        : '0';

    // Quote fetching
    const [quote, setQuote] = useState<DepositQuote | null>(null);
    const [isFetchingQuote, setIsFetchingQuote] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const fetchQuote = async () => {
            if (!fromAmount || parseFloat(fromAmount) <= 0) {
                if (!isCancelled) setQuote(null);
                return;
            }

            if (!isCancelled) {
                setIsFetchingQuote(true);
                setQuoteError(null);
            }

            try {
                // Determine decimals based on token
                const decimals = fromToken.decimals;
                const rawAmount = parseUnits(fromAmount, decimals).toString();

                // Use WETH address for native ETH quotes, otherwise use token address
                const inputTokenAddress = fromToken.isNative
                    ? WETH_ADDRESSES[fromChain.id]
                    : fromToken.address;

                const outputTokenAddress = toToken.isNative
                    ? WETH_ADDRESSES[toChain.id]
                    : toToken.address;

                if (!inputTokenAddress || !outputTokenAddress) {
                    // This handles cases where WETH mapping might be missing for a chain
                    console.error("Token address not found (or WETH mapping missing)");
                    throw new Error("Token address not found");
                }

                const quoteData = await getSuggestedFees(
                    fromChain.id,
                    toChain.id,
                    inputTokenAddress,
                    outputTokenAddress,
                    rawAmount
                );

                if (!isCancelled) setQuote(quoteData);
            } catch (err) {
                console.error("Error fetching quote:", err);
                if (!isCancelled) {
                    setQuoteError("Failed to fetch quote");
                    setQuote(null);
                }
            } finally {
                if (!isCancelled) setIsFetchingQuote(false);
            }
        };

        const timeoutId = setTimeout(fetchQuote, 500); // 500ms debounce

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [fromAmount, fromChain.id, toChain.id, fromToken.address, fromToken.decimals, fromToken.isNative, toToken.address, toToken.isNative]);

    // Contract interactions
    const spokePoolAddress = SPOKE_POOL_ADDRESSES[fromChain.id];
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, spokePoolAddress],
        query: {
            enabled: !!address && !fromToken.isNative,
        }
    });

    const { writeContract: writeApprove, isPending: isApproving, data: approveTxHash } = useWriteContract();
    const { writeContract: writeDeposit, isPending: isDepositing, data: depositTxHash } = useWriteContract();

    // Transaction receipts
    const { isLoading: isWaitingApprove, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveTxHash
    });

    // Refetch allowance after approval success
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    const { isLoading: isWaitingDeposit } = useWaitForTransactionReceipt({ hash: depositTxHash });

    const handleConnect = () => {
        const connector = connectors[0];
        if (connector) connect({ connector });
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const openSelector = (type: 'from' | 'to') => {
        setSelectorType(type);
        setSelectorOpen(true);
    };

    const handleSelect = (chain: Chain, token: Token) => {
        if (selectorType === 'from') {
            setFromChain(chain);
            setFromToken(token);
        } else {
            setToChain(chain);
            setToToken(token);
        }
    };

    const handleMax = () => {
        if (balanceFormatted) {
            setFromAmount(balanceFormatted);
        }
    };

    const handleApprove = () => {
        writeApprove({
            address: fromToken.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spokePoolAddress, BigInt(parseUnits(fromAmount, fromToken.decimals))],
            chainId: fromChain.id
        });
    };

    const handleBridge = () => {
        console.log("handleBridge called", { quote, fromAmount, recipientAddress });

        if (!quote || !quote.outputAmount) {
            console.error("Missing quote or output amount", quote);
            return;
        }

        const amountBigInt = BigInt(parseUnits(fromAmount, fromToken.decimals));
        const outputAmount = BigInt(quote.outputAmount);

        const recipient = recipientAddress || address;

        // Resolve WETH addresses for contract call if tokens are native
        const inputTokenAddress = fromToken.isNative
            ? WETH_ADDRESSES[fromChain.id]
            : fromToken.address;

        const outputTokenAddress = toToken.isNative
            ? WETH_ADDRESSES[toChain.id]
            : toToken.address;

        console.log("Calling depositV3 with:", {
            spokePoolAddress,
            depositor: address,
            recipient,
            inputToken: inputTokenAddress,
            outputToken: outputTokenAddress,
            amount: amountBigInt,
            outputAmount,
            destinationChainId: toChain.id,
            totalFee: quote.totalRelayFee.total
        });

        writeDeposit({
            address: spokePoolAddress,
            abi: SPOKE_POOL_ABI,
            functionName: 'depositV3',
            args: [
                address as `0x${string}`, // depositor
                recipient as `0x${string}`, // recipient
                inputTokenAddress as `0x${string}`, // inputToken
                outputTokenAddress as `0x${string}`, // outputToken
                amountBigInt, // inputAmount
                outputAmount, // outputAmount (from API)
                BigInt(toChain.id), // destinationChainId
                '0x0000000000000000000000000000000000000000', // exclusiveRelayer
                Number(quote.timestamp), // quoteTimestamp
                Number(quote.fillDeadline), // fillDeadline
                Number(quote.exclusivityDeadline), // exclusivityDeadline
                '0x', // message
            ],
            chainId: fromChain.id,
            value: fromToken.isNative ? amountBigInt : 0n, // Send ETH if native
        });
    };

    const needsApproval = !fromToken.isNative &&
        fromAmount &&
        allowance !== undefined &&
        allowance < parseUnits(fromAmount, fromToken.decimals);

    // Calculated To Amount (using API's outputAmount)
    const toAmountDisplay = quote && quote.outputAmount
        ? parseFloat(formatUnits(BigInt(quote.outputAmount), toToken.decimals)).toFixed(6)
        : '';

    // USD Estimation (assuming $1 for responsiveness)
    const usdValue = (parseFloat(fromAmount) || 0).toFixed(2);


    return (
        <div className="w-full max-w-[480px] p-4 mx-auto font-sans">
            <TokenSelector
                isOpen={selectorOpen}
                onClose={() => setSelectorOpen(false)}
                onSelect={handleSelect}
                type={selectorType}
                selectedChainId={selectorType === 'from' ? fromChain.id : toChain.id}
                selectedTokenSymbol={selectorType === 'from' ? fromToken.symbol : toToken.symbol}
            />

            {/* From Section */}
            <div className="bg-[#1b1b1b] rounded-2xl p-4 mb-2 relative border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm font-medium">From</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openSelector('from')}
                            className="flex items-center gap-2 bg-[#2b2b2b] hover:bg-[#3b3b3b] transition-colors rounded-full py-1.5 px-3 border border-white/5"
                        >
                            <div className={`w-6 h-6 rounded-full ${fromToken.iconBg} flex items-center justify-center text-[10px] text-white font-bold relative`}>
                                <span className={`absolute -bottom-1 -right-1 ${fromChain.iconBg} rounded-full w-3 h-3 border-2 border-[#2b2b2b]`}></span>
                                {fromToken.symbol[0]}
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-white font-semibold text-sm">{fromToken.symbol}</span>
                                <span className="text-gray-400 text-[10px]">{fromChain.name}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="0.00"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="bg-transparent text-4xl text-white font-medium outline-none w-full placeholder-gray-600"
                        />
                        <div className="text-gray-500 text-sm mt-1">
                            ${usdValue}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                            Balance: {parseFloat(balanceFormatted).toFixed(4)}
                            <button onClick={handleMax} className="text-[#5EEAD4] text-xs bg-[#5EEAD4]/10 px-2 py-0.5 rounded hover:bg-[#5EEAD4]/20 transition-colors">
                                MAX
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -my-5 relative z-10">
                <button className="bg-[#1b1b1b] border border-white/5 p-2 rounded-xl hover:bg-[#2b2b2b] transition-colors shadow-lg">
                    <ArrowDown className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* To Section */}
            <div className="bg-[#1b1b1b] rounded-2xl p-4 mt-2 border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-medium">To</span>
                        <div className="flex items-center gap-2">
                            {isEditingRecipient ? (
                                <div className="flex items-center bg-[#2b2b2b] rounded-lg border border-white/10 px-2 py-1">
                                    <input
                                        type="text"
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="bg-transparent text-xs text-white outline-none w-32 placeholder-gray-500"
                                        autoFocus
                                    />
                                    <X className="w-3 h-3 text-gray-400 cursor-pointer hover:text-white ml-2" onClick={() => setIsEditingRecipient(false)} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditingRecipient(true)}
                                    className="text-gray-500 text-xs hover:text-[#5EEAD4] transition-colors flex items-center gap-1"
                                >
                                    {recipientAddress ? (
                                        <span className="text-[#5EEAD4]">{formatAddress(recipientAddress)}</span>
                                    ) : (
                                        <span>Set Recipient ✎</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Token Selector */}
                    <button
                        onClick={() => openSelector('to')}
                        className="flex items-center gap-2 bg-[#2b2b2b] hover:bg-[#3b3b3b] transition-colors rounded-full py-1.5 px-3 border border-white/5"
                    >
                        <div className={`w-6 h-6 rounded-full ${toToken.iconBg} flex items-center justify-center text-[10px] text-white font-bold relative`}>
                            <span className={`absolute -bottom-1 -right-1 ${toChain.iconBg} rounded-full w-3 h-3 border-2 border-[#2b2b2b]`}></span>
                            {toToken.symbol[0]}
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-white font-semibold text-sm">{toToken.symbol}</span>
                            <span className="text-gray-400 text-[10px]">{toChain.name}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex-1">
                        {isFetchingQuote ? (
                            <div className="h-10 flex items-center text-gray-500 animate-pulse">Fetching quote...</div>
                        ) : (
                            <input
                                type="text"
                                placeholder="0.00"
                                value={toAmountDisplay}
                                readOnly
                                className="bg-transparent text-4xl text-gray-500 font-medium outline-none w-full placeholder-gray-600"
                            />
                        )}
                        <div className="text-gray-500 text-sm mt-1">
                            {toAmountDisplay ? `$${(parseFloat(toAmountDisplay) * 1).toFixed(2)}` : '$0.00'}
                        </div>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">
                        Balance: 0
                    </div>
                </div>
                {quote && quote.isAmountTooLow && (
                    <div className="mt-2 text-red-500 text-xs font-medium text-center bg-red-500/10 py-1.5 rounded-lg border border-red-500/20">
                        ⚠️ Amount too low. Please increase amount.
                    </div>
                )}
            </div>

            {/* Info Banner */}
            <div className="bg-[#1b1b1b] rounded-2xl p-3 mt-4 border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-[#4ADE80]">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-bold">Fast & Secure</span>
                    </div>
                    <X className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" />
                </div>

                {/* Fee Breakdown */}
                {quote && quote.totalRelayFee && (
                    <div className="bg-[#2b2b2b] rounded-lg p-2 mb-3 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Total Fee:</span>
                            <span className="text-white font-medium">
                                {formatUnits(BigInt(quote.totalRelayFee.total), fromToken.decimals)} {fromToken.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">├ Gas Fee:</span>
                            <span className="text-gray-400">
                                {formatUnits(BigInt(quote.relayerGasFee.total), fromToken.decimals)} {fromToken.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">├ Capital Fee:</span>
                            <span className="text-gray-400">
                                {formatUnits(BigInt(quote.relayerCapitalFee.total), fromToken.decimals)} {fromToken.symbol}
                            </span>
                        </div>
                        {quote.lpFee && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">└ LP Fee:</span>
                                <span className="text-gray-400">
                                    {formatUnits(BigInt(quote.lpFee.total), fromToken.decimals)} {fromToken.symbol}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                            <span className="text-gray-400">You'll receive:</span>
                            <span className="text-[#5EEAD4] font-semibold">
                                {toAmountDisplay} {toToken.symbol}
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Action Button */}
                {!isConnected ? (
                    <button
                        onClick={handleConnect}
                        className="w-full bg-[#5EEAD4] hover:bg-[#4dd6c1] text-[#0f172a] font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(94,234,212,0.3)]"
                    >
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        {needsApproval ? (
                            <button
                                onClick={handleApprove}
                                disabled={isApproving || isWaitingApprove}
                                className="w-full bg-[#fcd34d] hover:bg-[#fbbf24] text-[#0f172a] font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                            >
                                {(isApproving || isWaitingApprove) && <div className="w-5 h-5 animate-spin border-2 border-white/20 border-t-white rounded-full"></div>}
                                {isApproving ? 'Approving...' : isWaitingApprove ? 'Waiting Confirmation...' : `Approve ${fromToken.symbol}`}
                            </button>
                        ) : (
                            <button
                                onClick={handleBridge}
                                disabled={!fromAmount || !!quoteError || isDepositing || isWaitingDeposit || isFetchingQuote || (quote?.isAmountTooLow ?? false)}
                                className="w-full bg-[#5EEAD4] hover:bg-[#4dd6c1] text-[#0f172a] font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(94,234,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {(isDepositing || isWaitingDeposit) && <div className="w-5 h-5 animate-spin border-2 border-[#0f172a]/20 border-t-[#0f172a] rounded-full"></div>}
                                {isDepositing ? 'Bridging...' : isWaitingDeposit ? 'Finalizing...' : 'Bridge Funds'}
                            </button>
                        )}

                        <div className="text-xs text-center text-gray-500 cursor-pointer hover:text-white" onClick={() => disconnect()}>
                            Disconnect {formatAddress(address || '')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BridgeWidget;
