import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTicketAlt, FaCalendarCheck, FaChartLine, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, AnimatedSection, GlowingButton, GradientBadge } from '../components/ui/PremiumComponents';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [myEvents, setMyEvents] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const navigate = useNavigate();

    // Memoize heavy calculations
    const totalTicketsSold = useMemo(() => {
        return myEvents.reduce((acc, event) => acc + (event.soldTickets || 0), 0);
    }, [myEvents]);

    const totalRevenue = useMemo(() => {
        return myEvents.reduce((acc, event) => acc + ((event.soldTickets || 0) * event.price), 0);
    }, [myEvents]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Artificial delay removed for performance


            try {
                if (user.role === 'organizer' || user.role === 'admin') {
                    const response = await axios.get('http://localhost:5000/api/events/my-events', config);
                    setMyEvents(response.data);
                }

                if (user.role === 'user') {
                    const bookingRes = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
                    setMyBookings(bookingRes.data);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const confirmDelete = (event) => {
        setEventToDelete(event);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!eventToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/events/${eventToDelete._id}`, config);
            toast.success('Event deleted successfully');
            setMyEvents(myEvents.filter(event => event._id !== eventToDelete._id));
            setDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete event');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-transparent py-10 relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold font-heading text-white">
                            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Overview</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Good morning, {user.name} 👋</p>
                    </div>
                    {user.role === 'organizer' && (
                        <Link to="/create-event">
                            <GlowingButton className="flex items-center gap-2 py-3 px-6 rounded-xl">
                                <FaPlus /> Create New Event
                            </GlowingButton>
                        </Link>
                    )}
                </motion.div>

                {/* Organizer Dashboard */}
                {(user.role === 'organizer' || user.role === 'admin') && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12"
                    >
                        {/* Stats Cards - Dark Glass & Neon */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GlassCard className="relative overflow-hidden group !bg-slate-800/60 !border-white/10 !backdrop-blur-xl">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-300 font-medium">Total Events</h3>
                                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 shadow-sm"><FaCalendarCheck size={20} /></div>
                                </div>
                                <p className="text-4xl font-bold text-white">{myEvents.length}</p>
                                <p className="text-sm text-slate-400 mt-2">published events</p>
                            </GlassCard>

                            <GlassCard className="relative overflow-hidden group !bg-slate-800/60 !border-white/10 !backdrop-blur-xl">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-300 font-medium">Tickets Sold</h3>
                                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shadow-sm"><FaTicketAlt size={20} /></div>
                                </div>
                                <p className="text-4xl font-bold text-white">
                                    {totalTicketsSold}
                                </p>
                                <p className="text-sm text-slate-400 mt-2">total bookings</p>
                            </GlassCard>

                            <GlassCard className="relative overflow-hidden group !bg-slate-800/60 !border-white/10 !backdrop-blur-xl">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/20 rounded-full blur-xl group-hover:bg-pink-500/30 transition-all"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-300 font-medium">Total Revenue</h3>
                                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 shadow-sm"><FaChartLine size={20} /></div>
                                </div>
                                <p className="text-4xl font-bold text-white">
                                    ₹{totalRevenue}
                                </p>
                                <p className="text-sm text-slate-400 mt-2">gross earnings</p>
                            </GlassCard>
                        </div>

                        {/* Events Table Section */}
                        <AnimatedSection delay={0.2}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">My Events</h2>
                            </div>

                            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-slate-300">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-white/5 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                                <th className="px-8 py-5">Event Details</th>
                                                <th className="px-8 py-5">Date</th>
                                                <th className="px-8 py-5">Sales</th>
                                                <th className="px-8 py-5">Status</th>
                                                <th className="px-8 py-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <AnimatePresence mode='popLayout'>
                                                {myEvents.length > 0 ? (
                                                    myEvents.map((event) => (
                                                        <motion.tr
                                                            layout
                                                            key={event._id}
                                                            variants={itemVariants}
                                                            className="hover:bg-white/5 transition-colors group"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                        >
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0 border border-white/10">
                                                                        <img
                                                                            src={event.image || 'https://via.placeholder.com/100'}
                                                                            alt=""
                                                                            loading="lazy"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white group-hover:text-orange-500 transition-colors">{event.title}</p>
                                                                        <p className="text-xs text-slate-400">{event.category}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5 font-medium">
                                                                {new Date(event.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="w-32">
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="font-bold text-slate-200">{event.soldTickets}</span>
                                                                        <span className="text-slate-500">/ {event.ticketLimit}</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full ${event.soldTickets >= event.ticketLimit ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                                                                            style={{ width: `${Math.min((event.soldTickets / event.ticketLimit) * 100, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                {new Date(event.date) < new Date() ? (
                                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">Completed</span>
                                                                ) : (
                                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30 flex items-center gap-1 w-fit">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                                    <Link to={`/events/${event._id}`} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="View">
                                                                        <FaEye />
                                                                    </Link>
                                                                    <Link to={`/edit-event/${event._id}`} className="p-2 hover:bg-white/10 rounded-lg text-amber-400 transition-colors" title="Edit">
                                                                        <FaEdit />
                                                                    </Link>
                                                                    <button onClick={() => confirmDelete(event)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Delete">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-12 text-center text-slate-500">
                                                            No events found. Start by creating one!
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </AnimatedSection>
                    </motion.div>
                )}

                {/* User Dashboard */}
                {user.role === 'user' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {myBookings.length > 0 ? (
                            <AnimatedSection>
                                <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-white/5 bg-slate-900/30">
                                        <h2 className="text-xl font-bold text-white">My Bookings</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-slate-300">
                                            <thead className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                                                <tr>
                                                    <th className="px-8 py-5">Event</th>
                                                    <th className="px-8 py-5">Date</th>
                                                    <th className="px-8 py-5">Tickets</th>
                                                    <th className="px-8 py-5">Amount</th>
                                                    <th className="px-8 py-5">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                <AnimatePresence>
                                                    {myBookings.map((booking, index) => (
                                                        <motion.tr
                                                            key={booking._id}
                                                            variants={itemVariants}
                                                            className="hover:bg-white/5 transition-colors"
                                                        >
                                                            <td className="px-8 py-5 font-bold text-white">
                                                                {booking.event?.title || 'Unknown Event'}
                                                            </td>
                                                            <td className="px-8 py-5 text-slate-400">
                                                                {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <GradientBadge>{booking.tickets} Tickets</GradientBadge>
                                                            </td>
                                                            <td className="px-8 py-5 font-bold text-white">
                                                                ₹{booking.totalAmount}
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                                                                    booking.status === 'cancelled' ? 'bg-red-900/30 text-red-400 border-red-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'
                                                                    }`}>
                                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                                </span>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ) : (
                            <AnimatedSection className="text-center py-20">
                                <GlassCard className="max-w-md mx-auto p-12 text-center !bg-slate-800/50 !border-white/10">
                                    <div className="bg-orange-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaTicketAlt className="text-3xl text-orange-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h2>
                                    <p className="text-slate-400 mb-8">You haven't booked any experiences yet. Your journey begins with a single ticket.</p>
                                    <Link to="/events">
                                        <GlowingButton className="px-8 py-3 rounded-xl">Explore Events</GlowingButton>
                                    </Link>
                                </GlassCard>
                            </AnimatedSection>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Floating Action Button (FAB) for Quick Create - Mobile Only */}
            {user.role === 'organizer' && (
                <div className="fixed bottom-6 right-6 md:hidden z-50">
                    <Link to="/create-event">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40"
                        >
                            <FaPlus className="text-xl" />
                        </motion.button>
                    </Link>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {eventToDelete && (
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Delete Event?"
                    message={`Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone and will remove the event from listings.`}
                    type="danger"
                />
            )}
        </div>
    );
};

export default Dashboard;
