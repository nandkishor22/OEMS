import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { GlowingButton } from '../components/ui/PremiumComponents';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden text-center p-4">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>

            {/* Floating Orbs */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-600/30 rounded-full blur-[80px]"
            />
            <motion.div
                animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-600/20 rounded-full blur-[100px]"
            />

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 relative inline-block"
                >
                    <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-transparent leading-none select-none opacity-20">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="bg-gradient-to-tr from-orange-500 to-red-600 w-40 h-40 rounded-full blur-xl opacity-50"
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center text-8xl">
                            🚀
                        </div>
                    </div>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
                    Lost in Space?
                </h2>
                <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-lg mx-auto">
                    The page you are looking for has drifted away into the cosmic void. Let's get you back to safety.
                </p>

                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <GlowingButton className="px-8 py-3 rounded-xl flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
                            <FaHome /> Return Home
                        </GlowingButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
