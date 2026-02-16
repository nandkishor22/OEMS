import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import { GlowingButton } from './PremiumComponents';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading = false, type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                    ></motion.div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${type === 'danger' ? 'bg-red-500' : 'bg-orange-500'}`}></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 shadow-lg border border-white/5 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {type === 'danger' ? <FaTrash /> : <FaExclamationTriangle />}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 font-heading">{title}</h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <GlowingButton
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 ${type === 'danger' ? '!bg-gradient-to-r !from-red-600 !to-pink-600' : ''}`}
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            {type === 'danger' ? 'Delete' : 'Confirm'} <FaCheck />
                                        </>
                                    )}
                                </GlowingButton>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <FaTimes />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
