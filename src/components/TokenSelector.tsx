import { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CHAINS, TESTNET_CHAINS } from '../constants/chains';
import type { Chain, Token } from '../constants/chains';
import { ERC20_ABI } from '../constants/contracts';

interface TokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (chain: Chain, token: Token) => void;
    selectedChainId?: number;
    selectedTokenSymbol?: string;
    type: 'from' | 'to';
    isTestnet?: boolean;
    fromChainId?: number;
    fromTokenSymbol?: string;
}

// Minimal route checking function (can be expanded with API data later)
const checkRouteAvailability = (
    fromChainId: number | undefined,
    fromTokenSymbol: string | undefined,
    _toChainId: number,
    toTokenSymbol: string
): boolean => {
    // If not in 'to' selection mode, everything is available
    if (!fromChainId || !fromTokenSymbol) return true;

    // RULE 1: Standard Bridge - Same Token is usually supported
    if (fromTokenSymbol === toTokenSymbol) return true;

    // RULE 2: Native ETH <-> WETH is supported
    const isEthOrWeth = (symbol: string) => ['ETH', 'WETH'].includes(symbol);
    if (isEthOrWeth(fromTokenSymbol) && isEthOrWeth(toTokenSymbol)) return true;

    // Rule 3: Cross-chain swaps are generally restricted in this MVP to prevent user error
    // until we implement the full Available Routes API check.
    return false;
};

// Token balance component
const TokenBalance = ({ token, chainId }: { token: Token; chainId: number }) => {
    const { address } = useAccount();

    // Fetch native token balance
    const { data: nativeBalance } = useBalance({
        address,
        chainId,
        query: { enabled: !!address && token.isNative },
    });

    // Fetch ERC20 token balance
    const { data: erc20Balance } = useReadContract({
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        chainId,
        query: { enabled: !!address && !token.isNative },
    });

    // Get balance based on token type
    let balance: string;
    if (token.isNative && nativeBalance && 'formatted' in nativeBalance) {
        balance = (nativeBalance as any).formatted;
    } else if (!token.isNative && erc20Balance) {
        balance = formatUnits(erc20Balance as bigint, token.decimals);
    } else {
        balance = '0';
    }

    const displayBalance = parseFloat(balance || '0').toFixed(4);

    if (!address) return null;

    return (
        <span className="text-gray-500 text-xs">
            {displayBalance}
        </span>
    );
};

const TokenSelector = ({
    isOpen, onClose, onSelect,
    selectedChainId, selectedTokenSymbol, isTestnet = false,
    fromChainId, fromTokenSymbol
}: TokenSelectorProps) => {
    const [search, setSearch] = useState('');
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);

    // Filter chains based on search and mode
    const filteredChains = useMemo(() => {
        const chainsToUse = isTestnet ? TESTNET_CHAINS : CHAINS;
        if (!search) return chainsToUse;
        return chainsToUse.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, isTestnet]);

    // Filter tokens for the selected chain
    const chainTokens = useMemo(() => {
        if (!selectedChain) return [];
        if (!search) return selectedChain.tokens;
        return selectedChain.tokens.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase()));
    }, [selectedChain, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1b1b1b] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl flex flex-col max-h-[600px] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1b1b1b] z-10 sticky top-0">
                    <h2 className="text-white font-bold text-lg">
                        {selectedChain ? 'Select Token' : 'Select Network'}
                    </h2>
                    <button onClick={() => { onClose(); setSelectedChain(null); setSearch(''); }} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder={selectedChain ? `Search ${selectedChain.name} tokens` : "Search networks"}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#5EEAD4]/50 transition-colors"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {!selectedChain ? (
                        // Network List
                        <div className="space-y-1">
                            {filteredChains.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => { setSelectedChain(chain); setSearch(''); }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group ${selectedChainId === chain.id ? 'bg-white/5 border border-white/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {chain.logoUrl ? (
                                            <img src={chain.logoUrl} alt={chain.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full ${chain.iconBg} flex items-center justify-center text-white font-bold`}>
                                                {chain.name[0]}
                                            </div>
                                        )}
                                        <span className="text-white font-medium">{chain.name}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Token List
                        <div className="space-y-1">
                            {chainTokens.length > 0 ? (
                                chainTokens.map((token) => {
                                    const isAvailable = checkRouteAvailability(fromChainId, fromTokenSymbol, selectedChain.id, token.symbol);

                                    return (
                                        <button
                                            key={token.symbol}
                                            disabled={!isAvailable}
                                            onClick={() => {
                                                if (!isAvailable) return;
                                                onSelect(selectedChain, token);
                                                onClose();
                                                // Reset state after slight delay or immediately
                                                setTimeout(() => {
                                                    setSelectedChain(null);
                                                    setSearch('');
                                                }, 200);
                                            }}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group relative overflow-hidden
                                            ${!isAvailable ? 'opacity-50 cursor-not-allowed bg-white/5 grayscale' : 'hover:bg-white/5'}
                                            ${selectedTokenSymbol === token.symbol ? 'bg-white/5 border border-white/5' : ''}
                                        `}
                                        >
                                            <div className="flex items-center gap-3">
                                                {token.logoUrl ? (
                                                    <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full ${token.iconBg} flex items-center justify-center text-white font-bold text-xs`}>
                                                        {token.symbol[0]}
                                                    </div>
                                                )}
                                                <div className="flex flex-col items-start">
                                                    <span className="text-white font-medium">{token.symbol}</span>
                                                    <span className="text-gray-500 text-xs">{token.name || token.symbol}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <TokenBalance token={token} chainId={selectedChain.id} />
                                                {selectedTokenSymbol === token.symbol && <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />}

                                                {!isAvailable && (
                                                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 mt-1">
                                                        NO ROUTE
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-gray-500 text-center py-8">No tokens found</div>
                            )}

                            <button onClick={() => setSelectedChain(null)} className="w-full text-center text-gray-400 text-sm mt-4 hover:text-white transition-colors">
                                ← Select different network
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenSelector;
