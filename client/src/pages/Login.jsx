import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { GlassCard, PremiumInput, GlowingButton } from '../components/ui/PremiumComponents';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                toast.success(`Welcome back, ${response.data.name}!`);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 overflow-hidden">
            {/* 🌌 IMPROVED BACKGROUND EFFECT */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            {/* Large Vibrant Blobs - Updated to Sunset Orange Theme */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] animate-blob"></div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">

                {/* Left Side: Hero Text (Visible on Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:block w-1/2 text-white"
                >
                    <h1 className="text-6xl font-bold font-heading mb-6 leading-tight">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Eventify.</span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md">
                        Discover extraordinary events, book your tickets seamlessly, and manage your experiences all in one place.
                    </p>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-default">
                            <p className="text-2xl font-bold text-orange-400 group-hover:text-orange-300">10k+</p>
                            <p className="text-xs text-slate-400">Active Users</p>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-default">
                            <p className="text-2xl font-bold text-red-400 group-hover:text-red-300">500+</p>
                            <p className="text-xs text-slate-400">Events Hosted</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Glass Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-1/2 max-w-md"
                >
                    <GlassCard className="!bg-slate-900/60 !backdrop-blur-3xl !border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50"></div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white font-heading">Sign In</h2>
                            <p className="text-slate-300 mt-2">Access your account</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <PremiumInput
                                icon={FaEnvelope}
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={onChange}
                                required
                                className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                            />

                            <PremiumInput
                                icon={FaLock}
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={onChange}
                                required
                                className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                            />

                            <div className="flex items-center justify-between text-sm text-slate-300">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-white/10 bg-black/20 text-orange-500 focus:ring-offset-slate-900 focus:ring-orange-500" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="hover:text-orange-400 transition-colors">Forgot password?</a>
                            </div>

                            <GlowingButton type="submit" className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-orange-600/20">
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </GlowingButton>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 text-slate-400 bg-transparent">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-all mb-6 hover:border-white/20"
                        >
                            <FaGoogle className="text-orange-500" /> Sign in with Google
                        </button>

                        <p className="text-center text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-orange-500 hover:text-orange-400 transition-colors">
                                Create free account
                            </Link>
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
