import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { GlassCard, PremiumInput, GlowingButton } from '../components/ui/PremiumComponents';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, role } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                toast.success('Welcome to Eventify!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 overflow-hidden">
            {/* 🌌 IMPROVED BACKGROUND EFFECT */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            {/* Large Vibrant Blobs - Sunset Orange Theme */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">

                {/* Left Side: Hero Text (Visible on Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:block w-1/2 text-white"
                >
                    <h1 className="text-6xl font-bold font-heading mb-6 leading-tight">
                        Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Journey.</span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md">
                        Join our community of event enthusiasts. Create unique experiences, discover new passions, and connect with people who share your vibe.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-slate-300 group hover:text-white transition-colors">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold border border-green-500/20">✓</div>
                            <span>Instant Booking Confirmation</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300 group hover:text-white transition-colors">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold border border-orange-500/20">✓</div>
                            <span>Secure Payments & Refunds</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300 group hover:text-white transition-colors">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold border border-red-500/20">✓</div>
                            <span>24/7 Dedicated Support</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Glass Register Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-1/2 max-w-lg"
                >
                    <GlassCard className="!bg-slate-900/60 !backdrop-blur-3xl !border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50"></div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white font-heading">Create Account</h2>
                            <p className="text-slate-300 mt-2">Join us today for free</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <PremiumInput
                                icon={FaUser}
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={name}
                                onChange={onChange}
                                required
                                className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                            />

                            <PremiumInput
                                icon={FaEnvelope}
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={onChange}
                                required
                                className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PremiumInput
                                    icon={FaLock}
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                                />
                                <PremiumInput
                                    icon={FaLock}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    required
                                    className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 focus:!bg-black/40"
                                />
                            </div>

                            {/* Role Selection - Orange/Red Theme */}
                            <div className="p-1 bg-black/20 rounded-xl flex border border-white/5">
                                <label className={`flex-1 cursor-pointer rounded-lg py-3 text-center transition-all ${role === 'user' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                    <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setFormData({ ...formData, role: 'user' })} className="sr-only" />
                                    <span className="font-bold text-sm">Book Events</span>
                                </label>
                                <label className={`flex-1 cursor-pointer rounded-lg py-3 text-center transition-all ${role === 'organizer' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                    <input type="radio" name="role" value="organizer" checked={role === 'organizer'} onChange={() => setFormData({ ...formData, role: 'organizer' })} className="sr-only" />
                                    <span className="font-bold text-sm">Host Events</span>
                                </label>
                            </div>

                            <GlowingButton type="submit" className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-orange-600/20">
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </GlowingButton>
                        </form>

                        <p className="mt-6 text-center text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-orange-500 hover:text-orange-400 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
