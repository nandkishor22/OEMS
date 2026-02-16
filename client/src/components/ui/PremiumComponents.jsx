import { motion } from 'framer-motion';

// 1. Premium Gradient Button
export const GlowingButton = ({ children, onClick, className = "", disabled = false, ...props }) => {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, textShadow: "0px 0px 8px rgb(255, 100, 100)" } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            disabled={disabled}
            className={`
                btn-gradient relative overflow-hidden group will-change-transform 
                ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'} 
                ${className}
            `}
            onClick={disabled ? undefined : onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </motion.button>
    );
};

// 2. Glass Card Platform Spec - REFINED
export const GlassCard = ({ children, className = "", hoverEffect = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`
                bg-slate-800/20 backdrop-blur-xl backdrop-saturate-150
                border border-white/5 
                rounded-3xl shadow-xl p-8 will-change-transform ${className}
                ${hoverEffect ? 'hover:shadow-2xl hover:bg-slate-800/30 hover:border-white/10 hover:-translate-y-1 transition-all duration-500 ease-out' : ''}
            `}
        >
            {children}
        </motion.div>
    );
};

// 3. Animated Section Wrapper
export const AnimatedSection = ({ children, delay = 0, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: delay, ease: [0.22, 1, 0.36, 1] }}
            className={`will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
};

// 4. Badge / Tag
export const GradientBadge = ({ children, className = "" }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm ${className}`}>
            {children}
        </span>
    );
};

// 5. Input Field - Dark Glass & Responsive Padding
export const PremiumInput = ({ icon: Icon, className = "", ...props }) => {
    return (
        <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500 text-slate-500">
                {Icon && <Icon className="text-xl" />}
            </div>
            <input
                {...props}
                className={`
                    w-full ${Icon ? 'pl-14' : 'pl-5'} pr-5 py-4 
                    bg-slate-900/40 backdrop-blur-md border border-white/5 
                    rounded-2xl focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 
                    outline-none transition-all duration-300 
                    placeholder:text-slate-600 font-medium text-white shadow-inner 
                    group-hover:bg-slate-900/60 
                    ${className}
                `}
            />
        </div>
    );
};

// 6. Skeleton Loader - Dark Mode
export const Skeleton = ({ className = "" }) => {
    return (
        <div className={`animate-pulse bg-slate-800/50 rounded-xl ${className}`}></div>
    );
};
