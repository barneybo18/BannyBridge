import { useState, useEffect } from 'react';
import { ArrowDown, X, ChevronDown, RefreshCw, Settings, Info } from 'lucide-react';
import { useAccount, useConnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import TokenSelector from './TokenSelector';
import { CHAINS, TESTNET_CHAINS } from '../constants/chains';
import type { Chain, Token } from '../constants/chains';
import { ERC20_ABI, SPOKE_POOL_ABI, SPOKE_POOL_ADDRESSES, WETH_ADDRESSES } from '../constants/contracts';
import { getQuote, type QuoteResult } from '../utils/acrossApi';
import { getTokenPrice, invalidatePriceCache } from '../utils/priceApi';

import { APP_FEE_PERCENTAGE } from '../constants/integrator';
import TransactionModal from './TransactionModal';

const BridgeWidget = () => {
    // App Mode State
    const [isTestnet, setIsTestnet] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Active Chains based on mode
    const activeChains = isTestnet ? TESTNET_CHAINS : CHAINS;

    // Input state
    const [fromAmount, setFromAmount] = useState('');

    // Recipient state
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isEditingRecipient, setIsEditingRecipient] = useState(false);

    // Default selections
    // Default selections (Update when chains change)
    useEffect(() => {
        // Reset selections when switching modes
        if (isTestnet) {
            setFromChain(activeChains[0]); // Sepolia
            setFromToken(activeChains[0].tokens[0]); // ETH
            setToChain(activeChains[1]); // Arbitrum Sepolia
            setToToken(activeChains[1].tokens[0]); // ETH
        } else {
            setFromChain(activeChains[4]); // Base
            setFromToken(activeChains[4].tokens.find(t => t.symbol === 'USDC') || activeChains[4].tokens[1]);
            setToChain(activeChains[5]); // Arbitrum
            setToToken(activeChains[5].tokens.find(t => t.symbol === 'USDC') || activeChains[5].tokens[1]);
        }
    }, [isTestnet]);

    const [fromChain, setFromChain] = useState<Chain>(() => activeChains[isTestnet ? 0 : 4]);
    const [fromToken, setFromToken] = useState<Token>(() => {
        const chain = activeChains[isTestnet ? 0 : 4];
        return isTestnet ? chain.tokens[0] : (chain.tokens.find(t => t.symbol === 'USDC') || chain.tokens[1]);
    });

    const [toChain, setToChain] = useState<Chain>(() => activeChains[isTestnet ? 1 : 5]);
    const [toToken, setToToken] = useState<Token>(() => {
        const chain = activeChains[isTestnet ? 1 : 5];
        return isTestnet ? chain.tokens[0] : (chain.tokens.find(t => t.symbol === 'USDC') || chain.tokens[1]);
    });

    // Selector state
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [selectorType, setSelectorType] = useState<'from' | 'to'>('from');

    // Transaction Modal State
    const [showModal, setShowModal] = useState(false);
    const [txStatus, setTxStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [currentTxHash, setCurrentTxHash] = useState<string | undefined>(undefined);
    const [txError, setTxError] = useState<string | undefined>(undefined);

    // Wallet state
    const { address, isConnected, chain: connectedChain } = useAccount();
    const { connectors, connect } = useConnect();

    // Removed duplicate declaration and unused disconnect
    const { switchChain, isPending: isSwitchingChain } = useSwitchChain(); // preserving this line as is

    // Balance fetching (Native)
    const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
        address,
        chainId: fromChain.id,
        query: { enabled: !!address && fromToken.isNative }
    });

    // Balance fetching (ERC20)
    const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        chainId: fromChain.id,
        query: { enabled: !!address && !fromToken.isNative }
    });

    const balanceValue = fromToken.isNative ? nativeBalance?.value : tokenBalance;
    const balanceFormatted = balanceValue !== undefined ? formatUnits(balanceValue, fromToken.decimals) : '0';

    // Quote fetching
    const [quote, setQuote] = useState<QuoteResult | null>(null);
    const [isFetchingQuote, setIsFetchingQuote] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [tokenPrice, setTokenPrice] = useState<number>(1);
    const [toTokenPrice, setToTokenPrice] = useState<number>(1);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [priceRefreshTrigger, setPriceRefreshTrigger] = useState<number>(0);

    // Fetch prices with real-time updates (polling every 30 seconds)
    useEffect(() => {
        let isCancelled = false;
        let priceInterval: number;

        const fetchPrices = async () => {
            console.log(`[PriceEffect] Fetching prices for ${fromToken.symbol} and ${toToken.symbol}`);
            const [fromPrice, toPrice] = await Promise.all([
                getTokenPrice(fromToken.symbol),
                getTokenPrice(toToken.symbol)
            ]);
            if (!isCancelled) {
                console.log(`[PriceEffect] Set tokenPrice to ${fromPrice}, toTokenPrice to ${toPrice}`);
                setTokenPrice(fromPrice);
                setToTokenPrice(toPrice);
            }
        };

        // Initial fetch
        fetchPrices();

        // Set up polling every 30 seconds for real-time updates
        priceInterval = setInterval(() => {
            fetchPrices();
        }, 30000);

        return () => {
            isCancelled = true;
            if (priceInterval) clearInterval(priceInterval);
        };
    }, [fromToken.symbol, toToken.symbol, fromChain.id, priceRefreshTrigger]);

    useEffect(() => {
        let isCancelled = false;
        let refreshInterval: number;
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
                const inputAmount = parseUnits(fromAmount, fromToken.decimals);
                const inputTokenAddress = fromToken.isNative ? WETH_ADDRESSES[fromChain.id] : fromToken.address;
                const outputTokenAddress = toToken.isNative ? WETH_ADDRESSES[toChain.id] : toToken.address;
                if (!inputTokenAddress || !outputTokenAddress) throw new Error("Token address not found");
                const quoteResult = await getQuote(fromChain.id, toChain.id, inputTokenAddress, outputTokenAddress, inputAmount);
                if (!isCancelled) {
                    setQuote(quoteResult);
                    // setRefreshCountdown(30); - unused variable removed logic
                }
            } catch (err) {
                if (!isCancelled) {
                    let errorMessage = "Failed to fetch quote";
                    if (err instanceof Error) errorMessage = err.message;
                    setQuoteError(errorMessage);
                    setQuote(null);
                }
            } finally {
                if (!isCancelled) setIsFetchingQuote(false);
            }
        };
        const timeoutId = setTimeout(fetchQuote, 500);
        if (fromAmount && parseFloat(fromAmount) > 0) {
            refreshInterval = setInterval(() => { fetchQuote(); }, 30000);
        }
        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, [fromAmount, fromChain.id, toChain.id, fromToken.address, fromToken.decimals, fromToken.isNative, toToken.address, toToken.isNative, refreshTrigger]);

    /* 
    Unused effect for refreshCountdown
    useEffect(() => {
        if (!quote || !fromAmount || parseFloat(fromAmount) <= 0) return;
        const countdownInterval = setInterval(() => {
            setRefreshCountdown((prev) => {
                if (prev <= 1) return 30;
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdownInterval);
    }, [quote, fromAmount]);
    */

    // Contract interactions
    const spokePoolAddress = SPOKE_POOL_ADDRESSES[fromChain.id];
    const { data: allowance, refetch: refetchAllowance, isLoading: isAllowanceLoading } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, spokePoolAddress],
        query: { enabled: !!address && !fromToken.isNative }
    });

    const { writeContract: writeApprove, isPending: isApproving, data: approveTxHash } = useWriteContract();
    const { writeContract: writeDeposit, isPending: isDepositing, data: depositTxHash } = useWriteContract();
    // Removed unused useSendTransaction

    const { isLoading: isWaitingApprove, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash });
    useEffect(() => { if (isApproveSuccess) refetchAllowance(); }, [isApproveSuccess, refetchAllowance]);

    const { isLoading: isWaitingDeposit } = useWaitForTransactionReceipt({ hash: depositTxHash });
    // Removed isWaitingSwap

    const handleConnect = () => { const connector = connectors[0]; if (connector) connect({ connector }); };
    const handleRefreshQuote = () => { setRefreshTrigger(prev => prev + 1); /* setRefreshCountdown(30); */ };
    const handleSwitchChain = async () => { try { await switchChain({ chainId: fromChain.id }); } catch (error) { console.error("Error switching chain:", error); } };
    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const openSelector = (type: 'from' | 'to') => { setSelectorType(type); setSelectorOpen(true); };
    const handleSelect = (chain: Chain, token: Token) => {
        if (selectorType === 'from') { setFromChain(chain); setFromToken(token); }
        else { setToChain(chain); setToToken(token); }
    };
    const handleMax = () => { if (balanceFormatted) setFromAmount(balanceFormatted); };

    const handleApprove = () => {
        const amountToApprove = parseUnits(fromAmount, fromToken.decimals);
        writeApprove({ address: fromToken.address as `0x${string}`, abi: ERC20_ABI, functionName: 'approve', args: [spokePoolAddress, amountToApprove], chainId: fromChain.id });
    };

    const handleSwap = () => {
        const tempChain = fromChain; const tempToken = fromToken;
        setFromChain(toChain); setFromToken(toToken);
        setToChain(tempChain); setToToken(tempToken);
        setFromAmount('');
    };

    // const isSameChain = fromChain.id === toChain.id; // Unused variable
    const handleBridge = () => {
        if (!quote || !quote.deposit.outputAmount || !spokePoolAddress) return;
        const amountBigInt = BigInt(parseUnits(fromAmount, fromToken.decimals));
        const outputAmount = BigInt(quote.deposit.outputAmount);
        const recipient = recipientAddress || address;
        const inputTokenAddress = fromToken.isNative ? WETH_ADDRESSES[fromChain.id] : fromToken.address;
        const outputTokenAddress = toToken.isNative ? WETH_ADDRESSES[toChain.id] : toToken.address;

        try {
            writeDeposit({
                address: spokePoolAddress, abi: SPOKE_POOL_ABI, functionName: 'depositV3',
                args: [address as `0x${string}`, recipient as `0x${string}`, inputTokenAddress as `0x${string}`, outputTokenAddress as `0x${string}`, amountBigInt, outputAmount, BigInt(toChain.id), quote.deposit.exclusiveRelayer as `0x${string}`, Number(quote.deposit.quoteTimestamp), Number(quote.deposit.fillDeadline), Number(quote.deposit.exclusivityDeadline), quote.deposit.message as `0x${string}`],
                chainId: fromChain.id, value: fromToken.isNative ? amountBigInt : 0n, gas: 500000n
            }, {
                onSuccess: (hash) => {
                    setCurrentTxHash(hash);
                    // Don't set success yet, wait for receipt if possible, but for MVP:
                    // Actually, writeDeposit success just means tx sent to mempool. 
                    // We should keep 'processing' until useWaitForTransactionReceipt confirms it.
                },
                onError: (error) => {
                    setTxStatus('error');
                    setTxError(error.message || 'Transaction rejected');
                }
            });
            // Open modal immediately on click
            setTxStatus('processing');
            setShowModal(true);
            setTxError(undefined);

        } catch (error) {
            console.error("Error calling writeDeposit:", error);
            setTxStatus('error');
            setTxError('Failed to initiate transaction');
        }
    };

    // Watch for deposit receipt to confirm success
    useEffect(() => {
        if (isWaitingDeposit) {
            setTxStatus('processing');
        } else if (depositTxHash && !isWaitingDeposit && showModal && txStatus !== 'error') {
            // Transaction success - update status and refresh all data
            setTxStatus('success');

            // Invalidate price cache and trigger immediate refresh
            invalidatePriceCache();
            setPriceRefreshTrigger(prev => prev + 1);

            // Refresh balances after a short delay to allow chain state to update
            setTimeout(() => {
                if (fromToken.isNative) {
                    refetchNativeBalance();
                } else {
                    refetchTokenBalance();
                }
            }, 2000);

            // Also refresh the quote
            setRefreshTrigger(prev => prev + 1);
        }
    }, [isWaitingDeposit, depositTxHash, showModal, txStatus, fromToken.isNative, refetchNativeBalance, refetchTokenBalance]);

    const needsApproval = !fromToken.isNative && !!fromAmount && allowance !== undefined && allowance < parseUnits(fromAmount, fromToken.decimals);
    const isApprovalProcessing = isApproving || isWaitingApprove;

    let toAmountDisplay = '';
    try {
        if (quote?.deposit.outputAmount) {
            const outputBigInt = quote.deposit.outputAmount;
            const formatted = formatUnits(outputBigInt, toToken.decimals);
            const numericValue = parseFloat(formatted);
            toAmountDisplay = numericValue.toFixed(numericValue > 0 && numericValue < 0.000001 ? 10 : numericValue > 0 && numericValue < 0.01 ? 8 : 6);
        }
    } catch (error) { console.error("Error calculating toAmountDisplay:", error); }

    const isWrongChain = isConnected && connectedChain?.id !== fromChain.id;
    const usdValue = ((parseFloat(fromAmount) || 0) * tokenPrice).toFixed(2);
    let toUsdValue = '0.00';
    if (toAmountDisplay) {
        const usdAmount = parseFloat(toAmountDisplay) * toTokenPrice;
        toUsdValue = usdAmount > 0 ? (usdAmount < 0.01 ? usdAmount.toFixed(6) : usdAmount < 1 ? usdAmount.toFixed(4) : usdAmount.toFixed(2)) : '0.00';
    }

    return (
        <div className="w-full max-w-[480px] mx-auto relative font-sans">
            <TokenSelector
                isOpen={selectorOpen} onClose={() => setSelectorOpen(false)} onSelect={handleSelect}
                type={selectorType} selectedChainId={selectorType === 'from' ? fromChain.id : toChain.id}
                selectedTokenSymbol={selectorType === 'from' ? fromToken.symbol : toToken.symbol}
                isTestnet={isTestnet}
                fromChainId={selectorType === 'to' ? fromChain.id : undefined}
                fromTokenSymbol={selectorType === 'to' ? fromToken.symbol : undefined}
            />

            <TransactionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={txStatus}
                txHash={currentTxHash || depositTxHash}
                errorMsg={txError}
                fromChainName={fromChain.name}
                toChainName={toChain.name}
                tokenSymbol={fromToken.symbol}
                amount={fromAmount}
                explorerUrl={fromChain.blockExplorerUrl}
            />

            {/* Main Card */}
            <div className="bg-[#0A0E27] p-6 rounded-3xl border border-[#2D5BFF]/20 shadow-[0_0_50px_rgba(45,91,255,0.1)] relative overflow-hidden backdrop-blur-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xl font-space">Bridge</span>
                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${isTestnet ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-[#2D5BFF]/10 border-[#2D5BFF]/30 text-[#2D5BFF]'}`}>
                            {isTestnet ? 'TESTNET' : 'V2'}
                        </div>
                    </div>
                    <div className="flex gap-2 relative">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                            onClick={handleRefreshQuote}
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetchingQuote ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        {/* Settings Dropdown */}
                        {settingsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0E27] border border-[#2D5BFF]/30 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                <div className="p-3">
                                    <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Settings</h4>
                                    <button
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white"
                                        onClick={() => {
                                            setIsTestnet(!isTestnet);
                                            setSettingsOpen(false);
                                        }}
                                    >
                                        <span>Mode</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isTestnet ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {isTestnet ? 'TESTNET' : 'MAINNET'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* From Box */}
                <div className="bg-[#131b36] rounded-xl p-4 border border-transparent hover:border-[#2D5BFF]/30 transition-all group">
                    <div className="flex justify-between text-gray-400 text-sm mb-3">
                        <span className="font-medium">From {fromChain.name}</span>
                        <div className="flex items-center gap-2">
                            <span>Balance: {parseFloat(balanceFormatted).toFixed(4)}</span>
                            <button onClick={handleMax} className="text-[#2D5BFF] text-xs font-bold hover:text-[#4DFFFF] transition-colors">MAX</button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="0.00"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="bg-transparent text-4xl text-white font-medium outline-none w-full placeholder-gray-600 font-space min-w-0"
                        />
                        <button
                            onClick={() => openSelector('from')}
                            className="flex items-center gap-2 bg-[#0A0E27] hover:bg-[#1A2235] text-white rounded-full pl-2 pr-4 py-1.5 transition-all border border-[#2D5BFF]/20 hover:border-[#2D5BFF]/50 shrink-0"
                        >
                            <div className="relative">
                                {fromToken.logoUrl ? (
                                    <img src={fromToken.logoUrl} alt={fromToken.symbol} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className={`w-8 h-8 rounded-full ${fromToken.iconBg} flex items-center justify-center text-[10px] font-bold`}>{fromToken.symbol[0]}</div>
                                )}
                                {fromChain.logoUrl && (
                                    <img src={fromChain.logoUrl} alt={fromChain.name} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0E27]" />
                                )}
                            </div>
                            <div className="flex flex-col items-start pr-2">
                                <span className="font-bold text-base leading-tight">{fromToken.symbol}</span>
                                <span className="text-[10px] text-gray-400 leading-tight">${tokenPrice.toLocaleString()}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">${usdValue}</div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-[#0A0E27] p-1.5 rounded-xl border border-[#2D5BFF]/20 shadow-lg">
                        <button onClick={handleSwap} className="p-2 bg-[#131b36] hover:bg-[#1A2235] rounded-lg transition-colors group/arrow">
                            <ArrowDown className="w-4 h-4 text-[#2D5BFF] group-hover/arrow:text-[#4DFFFF] transition-colors" />
                        </button>
                    </div>
                </div>

                {/* To Box */}
                <div className="bg-[#131b36] rounded-xl p-4 border border-transparent hover:border-[#2D5BFF]/30 transition-all group mt-[-10px] pt-6">
                    <div className="flex justify-between text-gray-400 text-sm mb-3">
                        <span className="font-medium">To {toChain.name}</span>
                        <div className="flex items-center gap-2">
                            {isEditingRecipient ? (
                                <div className="flex items-center bg-[#0A0E27] rounded px-2 py-0.5 border border-[#2D5BFF]/30">
                                    <input
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        className="bg-transparent text-xs text-white outline-none w-24"
                                        placeholder="0x..."
                                        autoFocus
                                    />
                                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-white" onClick={() => setIsEditingRecipient(false)} />
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingRecipient(true)} className="flex items-center gap-1 hover:text-[#2D5BFF] transition-colors">
                                    {recipientAddress ? formatAddress(recipientAddress) : 'Recipient'}
                                    <span className="text-xs">✎</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        {isFetchingQuote ? (
                            <div className="h-10 text-gray-500 animate-pulse flex items-center text-2xl">Fetching...</div>
                        ) : (
                            <input
                                type="text"
                                value={toAmountDisplay}
                                readOnly
                                placeholder="0.00"
                                className="bg-transparent text-4xl text-[#00D4FF] font-medium outline-none w-full placeholder-gray-600 font-space min-w-0"
                            />
                        )}
                        <button
                            onClick={() => openSelector('to')}
                            className="flex items-center gap-2 bg-[#0A0E27] hover:bg-[#1A2235] text-white rounded-full pl-2 pr-4 py-1.5 transition-all border border-[#2D5BFF]/20 hover:border-[#2D5BFF]/50 shrink-0"
                        >
                            <div className="relative">
                                {toToken.logoUrl ? (
                                    <img src={toToken.logoUrl} alt={toToken.symbol} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className={`w-8 h-8 rounded-full ${toToken.iconBg} flex items-center justify-center text-[10px] font-bold`}>{toToken.symbol[0]}</div>
                                )}
                                {toChain.logoUrl && (
                                    <img src={toChain.logoUrl} alt={toChain.name} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0E27]" />
                                )}
                            </div>
                            <div className="flex flex-col items-start pr-2">
                                <span className="font-bold text-base leading-tight">{toToken.symbol}</span>
                                <span className="text-[10px] text-gray-400 leading-tight">${toTokenPrice.toLocaleString()}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">${toUsdValue}</div>
                </div>

                {/* Route/Fee Info */}
                {quote && !quoteError && (
                    <div className="mt-4 px-3 py-3 bg-[#2D5BFF]/5 rounded-xl border border-[#2D5BFF]/10 text-sm">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#2D5BFF]/10">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <span className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></span>
                                Across Route
                            </div>
                        </div>

                        {/* Fee Breakdown */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-gray-300 text-xs">
                                <span>Total Fee</span>
                                <span className="font-medium text-white">
                                    {quote.fees.totalRelayFee ? `${formatUnits(BigInt(quote.fees.totalRelayFee.total), fromToken.decimals)} ${fromToken.symbol}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-[10px] pl-2 border-l border-[#2D5BFF]/20 ml-0.5">
                                <span>Gas Fee</span>
                                <span>
                                    {quote.fees.relayerGasFee ? `${formatUnits(BigInt(quote.fees.relayerGasFee.total), fromToken.decimals)} ${fromToken.symbol}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-[10px] pl-2 border-l border-[#2D5BFF]/20 ml-0.5">
                                <span>Capital Fee</span>
                                <span>
                                    {quote.fees.relayerCapitalFee ? `${formatUnits(BigInt(quote.fees.relayerCapitalFee.total), fromToken.decimals)} ${fromToken.symbol}` : '-'}
                                </span>
                            </div>
                            {quote.fees.lpFee && (
                                <div className="flex justify-between text-gray-500 text-[10px] pl-2 border-l border-[#2D5BFF]/20 ml-0.5">
                                    <span>LP Fee</span>
                                    <span>
                                        {formatUnits(BigInt(quote.fees.lpFee.total), fromToken.decimals)} {fromToken.symbol}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-500 text-[10px] pl-2 border-l border-[#2D5BFF]/20 ml-0.5">
                                <span>Platform Fee</span>
                                <span>
                                    {fromAmount ? (Number(fromAmount) * APP_FEE_PERCENTAGE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : '0.00'} {toToken.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {quoteError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 items-start text-sm text-red-200">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                        <div>
                            <div className="font-bold text-red-400">Route Error</div>
                            {quoteError}
                        </div>
                    </div>
                )}

                {/* Main Button */}
                {!isConnected ? (
                    <button
                        onClick={handleConnect}
                        className="w-full mt-4 bg-[#2D5BFF] hover:bg-[#1a40cc] text-white font-bold py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(45,91,255,0.3)] hover:shadow-[0_0_30px_rgba(45,91,255,0.5)] active:scale-[0.99]"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            if (isWrongChain) {
                                handleSwitchChain();
                            } else if (needsApproval) {
                                handleApprove();
                            } else {
                                handleBridge();
                            }
                        }}
                        disabled={!isWrongChain && ((!needsApproval && (!fromAmount || !!quoteError || isDepositing || isFetchingQuote)) || (needsApproval && (isApprovalProcessing || isAllowanceLoading)))}
                        className={`w-full mt-4 font-bold py-4 rounded-xl text-lg transition-all active:scale-[0.99] flex justify-center items-center gap-2 ${isWrongChain ? 'bg-[#ff9f0a] hover:bg-[#d98200] text-black shadow-[0_0_20px_rgba(255,159,10,0.3)]' :
                            needsApproval ? 'bg-[#ffd60a] hover:bg-[#ccab00] text-black shadow-[0_0_20px_rgba(255,214,10,0.3)]' :
                                'bg-[#2D5BFF] hover:bg-[#00D4FF] text-white shadow-[0_0_20px_rgba(45,91,255,0.3)]'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {(isDepositing || isApprovalProcessing || isSwitchingChain) && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                        {isWrongChain ? `Switch to ${fromChain.name}` :
                            needsApproval ? (isApprovalProcessing ? 'Approving...' : 'Approve') :
                                isAllowanceLoading && !fromToken.isNative ? 'Checking Allowance...' :
                                    (isDepositing ? 'Bridging...' : 'Bridge Funds')}
                    </button>
                )}
            </div>

            {/* Powered By */}
            <div className="absolute -bottom-10 left-0 text-gray-500 text-xs font-mono flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-[#2D5BFF] rounded-full animate-pulse" />
                Powered by Across API
            </div>
        </div>
    );
};

export default BridgeWidget;
