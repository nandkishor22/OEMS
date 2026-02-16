import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMusic, FaLaptopCode, FaChalkboardTeacher, FaPalette, FaRunning, FaTicketAlt, FaUsers, FaRegCalendarCheck, FaArrowRight, FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GlassCard, GlowingButton, AnimatedSection } from '../components/ui/PremiumComponents';

const Home = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [featuredEvents, setFeaturedEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                setFeaturedEvents(res.data.slice(0, 3));
            } catch (err) {
                console.error("Error fetching events", err);
            }
        };
        fetchEvents();
    }, []);

    const categories = [
        { name: 'Music', icon: <FaMusic />, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
        { name: 'Tech', icon: <FaLaptopCode />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { name: 'Workshops', icon: <FaChalkboardTeacher />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
        { name: 'Arts', icon: <FaPalette />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { name: 'Sports', icon: <FaRunning />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    ];

    const testimonials = [
        { name: "Alex Morgan", role: "Event Organizer", text: "Eventify changed how I manage my concerts. It's incredibly intuitive!" },
        { name: "Sarah Chen", role: "Regular Attendee", text: "Best platform to find local tech meetups. The booking process is flawless." },
        { name: "David Miller", role: "Workshop Host", text: "The revenue tracking features help me grow my business effectively." }
    ];

    return (
        <div className="overflow-hidden bg-transparent">

            {/* 1. HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                            Discover & Manage <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
                                Events Effortlessly
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Book tickets, host events, and connect with communities — all in one premium platform designed for experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <GlowingButton
                                onClick={() => navigate('/events')}
                                className="px-10 py-5 text-xl rounded-full"
                            >
                                <span className="flex items-center gap-3">
                                    Explore Events <FaArrowRight />
                                </span>
                            </GlowingButton>

                            {(!user || user.role === 'organizer') && (
                                <button
                                    onClick={() => navigate('/create-event')}
                                    className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full font-bold text-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                                >
                                    Create Event
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Dashboard Preview / Floating Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 mx-auto max-w-5xl relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl">
                            <img
                                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                                alt="Event Crowd"
                                loading="lazy"
                                className="w-full h-64 md:h-[500px] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 will-change-transform"
                            />

                            {/* Floating Stats UI */}
                            <div className="absolute bottom-8 right-8 hidden md:block">
                                <GlassCard className="!p-6 !bg-slate-900/90 !border-white/10 flex items-center gap-5">
                                    <div className="bg-orange-500/20 p-4 rounded-full text-orange-500">
                                        <FaTicketAlt size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Tickets Sold</p>
                                        <p className="text-3xl font-bold text-white font-heading">12,450+</p>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. CATEGORIES SECTION */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">Explore Categories</h2>
                        <p className="text-slate-400 text-lg">Find events that match your passion</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.1, translateY: -5 }}
                                className="group cursor-pointer"
                            >
                                <div className={`flex flex-col items-center gap-4 p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 w-40 h-40 justify-center ${cat.bg} hover:bg-slate-800 hover:border-white/20`}>
                                    <div className={`text-4xl ${cat.color} drop-shadow-lg`}>
                                        {cat.icon}
                                    </div>
                                    <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED EVENTS SECTION */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                                Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Events</span>
                            </h2>
                            <p className="text-slate-400 text-lg">Don't miss out on these popular experiences</p>
                        </div>
                        <Link to="/events" className="hidden md:flex items-center gap-2 text-orange-400 font-bold hover:text-orange-300 transition-colors text-lg group">
                            View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.length > 0 ? featuredEvents.map((event, idx) => (
                            <AnimatedSection key={event._id} delay={idx * 0.1}>
                                <GlassCard className="!p-0 h-full flex flex-col overflow-hidden group hover:!shadow-2xl hover:!shadow-orange-500/20 hover:-translate-y-2 !bg-slate-800/40 !backdrop-blur-md !border-white/5">
                                    <div className="h-64 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                                        <img
                                            src={event.image || `https://source.unsplash.com/800x600/?event,${event.category}`}
                                            alt={event.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 will-change-transform"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'; }}
                                        />
                                        <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-orange-400 shadow-lg">
                                            {event.category}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-4">
                                            <FaRegCalendarCheck className="text-orange-500" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-2xl font-bold font-heading text-white mb-3 line-clamp-1 group-hover:text-orange-400 transition-colors">{event.title}</h3>
                                        <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed flex-grow">{event.description}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <span className="text-xl font-bold text-white">{event.price > 0 ? `₹${event.price}` : 'Free'}</span>
                                            <Link to={`/events/${event._id}`} className="px-6 py-2.5 bg-white/5 hover:bg-orange-600 text-white border border-white/10 hover:border-orange-500 rounded-xl font-semibold transition-all shadow-lg">
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            </AnimatedSection>
                        )) : (
                            // Dark Skeletons/Empty State
                            [1, 2, 3].map((n) => (
                                <div key={n} className="bg-slate-800/50 rounded-3xl h-[500px] animate-pulse border border-white/5" />
                            ))
                        )}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <GlowingButton onClick={() => navigate('/events')} className="px-8 py-3 rounded-xl">
                            View All Events
                        </GlowingButton>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-32 relative overflow-hidden">
                {/* Background accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">How It Works</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Start your journey with Eventify in three simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent -translate-y-1/2" />

                        {[
                            { title: 'Discover', desc: 'Browse through diverse categories and find events that vibe with you.', icon: <FaMusic /> },
                            { title: 'Book', desc: 'Secure your spot instantly with our seamless payment system.', icon: <FaTicketAlt /> },
                            { title: 'Enjoy', desc: 'Attend the event, check-in with QR codes, and make memories.', icon: <FaUsers /> }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative bg-slate-800/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 text-center hover:bg-slate-800 hover:border-orange-500/30 transition-all duration-300 group shadow-2xl"
                            >
                                <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <span className="text-orange-500 relative z-10">{step.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-4xl font-bold font-heading text-center mb-16 text-white">Trusted by Thousands</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <GlassCard key={i} className="!p-10 !bg-slate-800/30 !border-white/5 hover:!bg-slate-800/50">
                                <div className="flex gap-1 text-orange-500 mb-6">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                                <p className="text-slate-300 text-lg italic mb-8 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xl">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{t.name}</h4>
                                        <p className="text-slate-500 text-sm">{t.role}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CTA SECTION */}
            <section className="py-20 px-4 mb-20">
                <div className="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-90 transition-all duration-500 group-hover:scale-105" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black font-heading mb-8 text-white drop-shadow-md">Ready to Host Your Event?</h2>
                        <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-2xl mx-auto font-medium">Join thousands of organizers who use Eventify to create unforgettable experiences.</p>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="px-12 py-5 bg-white text-orange-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-orange-900/50 hover:scale-105 hover:bg-orange-50 transition-all duration-300"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
