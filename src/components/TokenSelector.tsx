import { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { CHAINS } from '../constants/chains';
import type { Chain, Token } from '../constants/chains';

interface TokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (chain: Chain, token: Token) => void;
    selectedChainId?: number;
    selectedTokenSymbol?: string;
    type: 'from' | 'to';
}

const TokenSelector = ({ isOpen, onClose, onSelect, selectedChainId, selectedTokenSymbol }: TokenSelectorProps) => {
    const [search, setSearch] = useState('');
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);

    // Filter chains based on search
    const filteredChains = useMemo(() => {
        if (!search) return CHAINS;
        return CHAINS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    // Filter tokens for the selected chain
    const chainTokens = useMemo(() => {
        if (!selectedChain) return [];
        if (!search) return selectedChain.tokens;
        return selectedChain.tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase()));
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
                                        <div className={`w-8 h-8 rounded-full ${chain.iconBg} flex items-center justify-center text-white font-bold`}>
                                            {chain.name[0]}
                                        </div>
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
                                chainTokens.map((token) => (
                                    <button
                                        key={token.symbol}
                                        onClick={() => {
                                            onSelect(selectedChain, token);
                                            onClose();
                                            // Reset state after slight delay or immediately
                                            setTimeout(() => {
                                                setSelectedChain(null);
                                                setSearch('');
                                            }, 200);
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group ${selectedTokenSymbol === token.symbol ? 'bg-white/5 border border-white/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${token.iconBg} flex items-center justify-center text-white font-bold text-xs`}>
                                                {token.symbol[0]}
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-white font-medium">{token.symbol}</span>
                                                <span className="text-gray-500 text-xs">{token.name}</span>
                                            </div>
                                        </div>
                                        {selectedTokenSymbol === token.symbol && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </button>
                                ))
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
