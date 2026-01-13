import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Timer, ExternalLink } from 'lucide-react';

interface TransactionModalProps {
    isOpen: boolean;
    status: 'idle' | 'processing' | 'success' | 'error';
    txHash: string | undefined;
    onClose: () => void;
    errorMsg?: string;
    fromChainName: string;
    toChainName: string;
    tokenSymbol: string;
    amount: string;
    explorerUrl: string;
}

const TransactionModal = ({ isOpen, status, txHash, onClose, errorMsg, fromChainName, toChainName, tokenSymbol, amount, explorerUrl }: TransactionModalProps) => {
    const [seconds, setSeconds] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    // Only start timer when txHash is available (wallet confirmed)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isOpen && status === 'processing' && txHash) {
            // Start the timer only after wallet confirmation
            if (!timerStarted) {
                setSeconds(0);
                setTimerStarted(true);
            }
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, status, txHash, timerStarted]);

    // Reset timer state when modal closes or new transaction
    useEffect(() => {
        if (!isOpen) {
            setSeconds(0);
            setTimerStarted(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-[#0A0E27] w-full max-w-md rounded-3xl p-6 border border-[#2D5BFF]/30 shadow-[0_0_50px_rgba(45,91,255,0.2)] relative animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button (only show if not processing) */}
                {status !== 'processing' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}

                <div className="flex flex-col items-center text-center">

                    {/* Status Icon */}
                    <div className="mb-6 relative">
                        {status === 'processing' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#2D5BFF] rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="w-20 h-20 rounded-full border-4 border-[#2D5BFF]/20 border-t-[#2D5BFF] animate-spin flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-[#2D5BFF] animate-spin" />
                                </div>
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20"></div>
                                <CheckCircle className="w-20 h-20 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20"></div>
                                <XCircle className="w-20 h-20 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            </div>
                        )}
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-2xl font-bold text-white mb-2 font-space">
                        {status === 'processing' && !txHash && 'Confirm in Wallet'}
                        {status === 'processing' && txHash && 'Processing Transaction...'}
                        {status === 'success' && 'Bridge Successful!'}
                        {status === 'error' && 'Transaction Failed'}
                    </h3>

                    <p className="text-gray-400 mb-6 text-sm">
                        {status === 'processing' && !txHash && 'Please confirm the transaction in your wallet to proceed.'}
                        {status === 'processing' && txHash && `Bridging ${amount} ${tokenSymbol} from ${fromChainName} to ${toChainName}`}
                        {status === 'success' && `Successfully bridged ${amount} ${tokenSymbol} to ${toChainName}!`}
                        {status === 'error' && (errorMsg || 'Something went wrong. Please try again.')}
                    </p>

                    {/* Timer / Check Details - Only show after wallet confirmation */}
                    <div className="w-full bg-[#1A1F35] rounded-xl p-4 mb-4 border border-white/5">
                        {status === 'processing' && !txHash ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">Waiting for wallet confirmation...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Timer className="w-4 h-4" /> Time Elapsed
                                    </span>
                                    <span className="text-white font-mono font-bold">
                                        {new Date(seconds * 1000).toISOString().substr(14, 5)}
                                    </span>
                                </div>
                                {status === 'processing' && (
                                    <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                                        <div className="bg-[#2D5BFF] h-full rounded-full animate-progress-indeterminate"></div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Tx Hash Link */}
                    {txHash && (
                        <a
                            href={`${explorerUrl}/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2D5BFF] hover:text-[#00D4FF] text-sm flex items-center gap-1 transition-colors"
                        >
                            View on Explorer <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {/* Success Action */}
                    {status === 'success' && (
                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-[#2D5BFF] hover:bg-[#1a40cc] text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(45,91,255,0.3)] hover:shadow-[0_0_30px_rgba(45,91,255,0.5)]"
                        >
                            Done
                        </button>
                    )}
                    {status === 'error' && (
                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
