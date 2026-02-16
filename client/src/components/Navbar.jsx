import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaCalendarAlt, FaPlus, FaCompass } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-orange-500 font-bold" : "text-slate-300 hover:text-orange-400 font-medium";
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'bg-slate-900/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/5 shadow-2xl py-3'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-600/20 group-hover:scale-105 group-hover:shadow-orange-600/40 transition-all duration-300">
                            E
                        </div>
                        <span className="text-2xl font-bold font-heading text-white tracking-tight group-hover:text-slate-200 transition-colors">
                            Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">ify</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/events" className={`transition-colors flex items-center gap-2 ${isActive('/events')}`}>
                            <FaCompass className={location.pathname === '/events' ? 'text-orange-500' : 'text-slate-400'} /> Explore
                        </Link>

                        {user?.role === 'organizer' && (
                            <Link to="/create-event" className={`transition-colors flex items-center gap-2 ${isActive('/create-event')}`}>
                                <FaPlus className={location.pathname === '/create-event' ? 'text-orange-500' : 'text-slate-400'} /> Create Event
                            </Link>
                        )}

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-3 py-1.5 px-2 pr-4 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-slate-900">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-200 text-sm">{user.name}</span>
                                </button>

                                {/* Dropdown Menu - Dark Theme Refined */}
                                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                    <div className="w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-2 ring-1 ring-black/50">
                                        <div className="px-4 py-4 border-b border-white/5 mb-2 bg-white/5 rounded-xl">
                                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                                        </div>

                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-orange-500/10 hover:text-orange-400 rounded-xl transition-all duration-200 group/item">
                                            <div className="p-1.5 bg-white/5 rounded-lg group-hover/item:bg-orange-500/20 transition-colors"><FaCalendarAlt /></div>
                                            Dashboard
                                        </Link>

                                        <div className="h-px bg-white/5 my-2 mx-2"></div>

                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group/item">
                                            <div className="p-1.5 bg-white/5 rounded-lg group-hover/item:bg-red-500/20 transition-colors"><FaSignOutAlt /></div>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-slate-300 hover:text-white font-semibold text-sm transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all"
                                    >
                                        Sign Up
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Refined */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden absolute w-full left-0 top-full shadow-2xl"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {user?.role === 'organizer' && (
                                <Link
                                    to="/create-event"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FaPlus /></div>
                                        Create Event
                                    </div>
                                </Link>
                            )}

                            <Link
                                to="/events"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FaCompass /></div>
                                    Explore Events
                                </div>
                            </Link>


                            {user ? (
                                <>
                                    <div className="border-t border-white/10 my-4 pt-4">
                                        <div className="flex items-center gap-3 px-4 py-2 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg">{user.name}</p>
                                                <p className="text-sm text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FaCalendarAlt /></div>
                                                Dashboard
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FaSignOutAlt /></div>
                                                Logout
                                            </div>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-8 px-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
                                        Log In
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-orange-600/20 transition-all">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
