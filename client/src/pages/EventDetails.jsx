import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaUser, FaTicketAlt, FaClock, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import TicketModal from '../components/ui/TicketModal';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();

        // Socket.io Real-time Updates
        const socket = io('http://localhost:5000');

        socket.on('update_seats', (data) => {
            if (data.eventId === id) {
                setEvent(prev => ({
                    ...prev,
                    soldTickets: data.soldTickets,
                    ticketLimit: prev.ticketLimit // Keep existing limit
                }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-4">Event Not Found</h2>
                <p className="text-slate-400 mb-8">The event you are looking for might have been removed or is unavailable.</p>
                <Link to="/events" className="text-orange-500 hover:text-orange-400 font-bold">Back to Events</Link>
            </div>
        );
    }

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }

        if (user.role !== 'user') {
            toast.error('Only users can book tickets');
            return;
        }

        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post('http://localhost:5000/api/bookings', { eventId: id, tickets: 1 }, config);

            toast.success('Booking Successful! Check your dashboard.');

            // Open Ticket Modal
            setBookingId(response.data._id || '12345');
            setTicketModalOpen(true);

            // Refresh event data to update seat count
            const eventResponse = await axios.get(`http://localhost:5000/api/events/${id}`);
            setEvent(eventResponse.data);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const isSoldOut = event.ticketLimit - event.soldTickets <= 0;

    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Blurred Background Hero */}
            <div
                className="absolute inset-0 top-0 h-[600px] w-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${event.image || 'https://via.placeholder.com/1200x500'})` }}
            >
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link to="/events" className="inline-flex items-center text-slate-300 hover:text-orange-500 mb-8 transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full font-medium border border-white/10 hover:border-orange-500/50">
                    <FaArrowLeft className="mr-2" /> Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Image & Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Image Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 rounded-3xl shadow-2xl overflow-hidden relative group border border-white/10"
                        >
                            <div className="aspect-w-16 aspect-h-9 md:aspect-h-7 h-[400px] md:h-[500px] relative">
                                <img
                                    src={event.image || 'https://via.placeholder.com/1200x500'}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute top-6 right-6 flex gap-3">
                                <span className="glass-dark px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg border border-white/20 backdrop-blur-md bg-black/40 text-orange-400">
                                    {event.category}
                                </span>
                                <button onClick={handleShare} className="bg-black/40 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors text-white">
                                    <FaShareAlt />
                                </button>
                            </div>
                        </motion.div>

                        {/* Event Title & Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                                {event.title}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/10">
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaCalendarAlt /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold">Date</p>
                                        <p className="font-semibold text-white">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><FaClock /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold">Time</p>
                                        <p className="font-semibold text-white">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold">Location</p>
                                        <p className="font-semibold text-white">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                                <h3 className="text-xl font-bold text-white mb-4">About this Event</h3>
                                <p className="leading-relaxed whitespace-pre-line">{event.description}</p>
                            </div>

                            {/* Organizer Info */}
                            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform -rotate-6 hover:rotate-0 transition-transform">
                                    {event.organizer?.name?.charAt(0) || <FaUser />}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 uppercase font-bold">Organized by</p>
                                    <h4 className="text-xl font-bold text-white">{event.organizer?.name || 'Unknown Organizer'}</h4>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Ticket Card (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                                <div className="relative z-10 text-center mb-8">
                                    <p className="text-slate-400 font-medium mb-1">Ticket Price</p>
                                    <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                                        {event.price > 0 ? `₹${event.price}` : 'Free'}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">per person</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                                        <span className="text-slate-300 font-medium flex items-center gap-2">
                                            <FaTicketAlt className="text-orange-500" /> Availability
                                        </span>
                                        <div className="text-right">
                                            <span className={`block font-bold ${isSoldOut ? 'text-red-500' : 'text-green-400'}`}>
                                                {isSoldOut ? 'Sold Out' : 'Available'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {event.ticketLimit - event.soldTickets} spots left
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {user?.role === 'organizer' ? (
                                    <div className="w-full py-4 bg-white/5 text-slate-500 font-bold text-lg rounded-xl text-center border-2 dashed border-white/10">
                                        Organizer View
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingLoading || isSoldOut}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group ${isSoldOut
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-500/30'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {bookingLoading ? 'Processing...' : (isSoldOut ? 'Sold Out' : <>Book Ticket <FaTicketAlt /></>)}
                                        </span>
                                        {!isSoldOut && <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>}
                                    </button>
                                )}

                                <p className="text-center text-xs text-slate-500 mt-6 mx-auto max-w-[200px] leading-relaxed">
                                    By booking, you agree to our Terms of Service. Non-refundable.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Ticket Modal */}
            <TicketModal
                isOpen={ticketModalOpen}
                onClose={() => setTicketModalOpen(false)}
                event={event}
                bookingId={bookingId}
                user={user}
            />
        </div>
    );
};

export default EventDetails;
