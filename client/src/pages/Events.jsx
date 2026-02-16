import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaSearch } from 'react-icons/fa';
import { Skeleton, GlassCard } from '../components/ui/PremiumComponents';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();

        // Socket.io for Real-time List Updates
        const socket = io('http://localhost:5000');

        socket.on('update_seats', (data) => {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === data.eventId
                        ? { ...event, soldTickets: data.soldTickets }
                        : event
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const filteredEvents = useMemo(() => {
        let result = events;

        if (searchTerm) {
            result = result.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(event => event.category === selectedCategory);
        }

        return result;
    }, [searchTerm, selectedCategory, events]);

    const categories = ['All', 'Music', 'Technology', 'Sports', 'Business', 'Arts', 'Education', 'Social', 'Other'];

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 space-y-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-4xl font-bold font-heading text-white">
                            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Events</span>
                        </h1>
                        {/* Search Bar - Fixed Icon Blur Issue */}
                        <div className="relative max-w-md w-full group">
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm group-hover:shadow-md text-white placeholder-slate-400"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Icon moved AFTER input to ensure it sits on top of the blur filter */}
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-white/50 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 transform scale-105'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-orange-400 border border-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-slate-800/50 rounded-3xl overflow-hidden shadow-lg border border-white/5">
                                <Skeleton className="h-48 w-full rounded-none bg-slate-700" />
                                <div className="p-5 space-y-4">
                                    <Skeleton className="h-8 w-3/4 bg-slate-700" />
                                    <Skeleton className="h-4 w-full bg-slate-700" />
                                    <Skeleton className="h-4 w-2/3 bg-slate-700" />
                                    <div className="flex justify-between pt-4">
                                        <Skeleton className="h-6 w-1/4 bg-slate-700" />
                                        <Skeleton className="h-10 w-1/4 rounded-lg bg-slate-700" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <GlassCard className="max-w-md mx-auto !bg-slate-800/80 !border-white/10">
                            <p className="text-xl text-slate-400 font-medium mb-4">No events found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                className="text-orange-500 hover:text-orange-400 font-bold underline decoration-2 underline-offset-4"
                            >
                                Clear Filters
                            </button>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassCard className="!p-0 h-full flex flex-col overflow-hidden group hover:!shadow-2xl hover:!shadow-orange-500/10 hover:-translate-y-2 !bg-slate-800/40 !backdrop-blur-md !border-white/10">
                                        <div className="h-48 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                                            <img
                                                src={event.image || 'https://via.placeholder.com/800x400?text=Event+Image'}
                                                alt={event.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 will-change-transform"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Event+Image'; }}
                                            />
                                            <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-400 shadow-sm uppercase tracking-wide border border-white/10">
                                                {event.category}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-grow flex flex-col">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors" title={event.title}>
                                                {event.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                {event.description}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                                                    <FaCalendarAlt className="text-orange-500" />
                                                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                                                    <FaMapMarkerAlt className="text-red-500" />
                                                    <span className="truncate font-medium">{event.location}</span>
                                                </div>

                                                <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/10">
                                                    <span className="text-2xl font-bold text-white">
                                                        {event.price > 0 ? `₹${event.price}` : 'Free'}
                                                    </span>
                                                    <Link
                                                        to={`/events/${event._id}`}
                                                        className="px-6 py-2.5 bg-orange-600 text-white text-sm rounded-xl font-bold hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 transition-all transform active:scale-95"
                                                    >
                                                        Book Seat
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
