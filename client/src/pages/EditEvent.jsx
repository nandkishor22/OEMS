import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt, FaInfoCircle, FaCheck, FaArrowLeft, FaImage, FaTrash } from 'react-icons/fa';
import { GlassCard, PremiumInput, GlowingButton } from '../components/ui/PremiumComponents';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // User validation check
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        } else if (user.role !== 'organizer' && user.role !== 'admin') {
            toast.error('Not authorized to edit events');
            window.location.href = '/';
        }
    }, [user]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Music',
        price: '0',
        ticketLimit: '',
        image: '',
        imgPreview: null
    });

    const { title, description, date, time, location, category, price, ticketLimit, image, imgPreview } = formData;

    useEffect(() => {
        const fetchEvent = async () => {
            // Artificial delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${id}`);
                const event = response.data;

                // Format date for input field (YYYY-MM-DD)
                const formattedDate = new Date(event.date).toISOString().split('T')[0];

                setFormData({
                    title: event.title,
                    description: event.description,
                    date: formattedDate,
                    time: event.time,
                    location: event.location,
                    category: event.category,
                    price: event.price,
                    ticketLimit: event.ticketLimit,
                    image: event.image || '',
                    imgPreview: event.image || ''
                });
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch event details');
                navigate('/dashboard');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const onChange = (e) => {
        if (e.target.name === 'image') {
            // Handle file upload check or text input
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imgPreview: URL.createObjectURL(file)
                }));
            } else {
                setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('You must be logged in');
            navigate('/login');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        let dataToSend = formData;

        try {
            await axios.put(`http://localhost:5000/api/events/${id}`, dataToSend, config);
            toast.success('Event Updated Successfully! 🎉');
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update event';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/events/${id}`, config);
            toast.success('Event Deleted Successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete event');
            setIsLoading(false);
            setDeleteModalOpen(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 relative overflow-hidden flex items-start justify-center pt-24">

            <GlassCard className="max-w-3xl w-full relative z-10 !p-0 overflow-hidden !bg-slate-900/60 backdrop-blur-3xl !border-white/10 shadow-2xl animate-fade-in">

                <div className="bg-gradient-to-r from-orange-600 to-red-600 py-6 px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg text-white">
                                <FaEdit size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Edit Event</h1>
                                <p className="text-orange-100 text-sm">Update your event details</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    <form onSubmit={onSubmit} className="space-y-6">

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <PremiumInput
                                icon={FaTag}
                                name="title"
                                value={title}
                                onChange={onChange}
                                placeholder="Event Title"
                                required
                                className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400"
                            />

                            <div className="relative group">
                                <div className="absolute top-4 left-4 pointer-events-none text-slate-400"><FaInfoCircle className="text-xl" /></div>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    rows="4"
                                    className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400 font-medium text-white resize-none shadow-sm"
                                    placeholder="Describe your event..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PremiumInput icon={FaMapMarkerAlt} name="location" value={location} onChange={onChange} placeholder="Location" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FaTag className="text-xl" /></div>
                                    <select
                                        name="category"
                                        value={category}
                                        onChange={onChange}
                                        className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-white appearance-none shadow-sm cursor-pointer"
                                    >
                                        {['Music', 'Technology', 'Sports', 'Business', 'Arts', 'Education', 'Social', 'Other'].map(cat => (
                                            <option key={cat} value={cat} className="bg-slate-800 text-white">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PremiumInput icon={FaCalendarAlt} type="date" name="date" value={date} onChange={onChange} required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 [color-scheme:dark]" />
                            <PremiumInput icon={FaCalendarAlt} type="time" name="time" value={time} onChange={onChange} required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 [color-scheme:dark]" />
                        </div>

                        {/* Image & Ticket Info */}
                        <div className="space-y-6">
                            {/* Keep image as text URL input for now */}
                            <PremiumInput icon={FaImage} type="url" name="image" value={image} onChange={onChange} placeholder="Image URL" className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PremiumInput icon={FaTag} type="number" name="price" value={price} onChange={onChange} placeholder="Price (₹)" min="0" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />
                                <PremiumInput icon={FaTicketAlt} type="number" name="ticketLimit" value={ticketLimit} onChange={onChange} placeholder="Total Tickets" min="1" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />
                            </div>
                        </div>

                        {/* Action Buttons - Refined Layout */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">

                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(true)}
                                className="w-full sm:w-auto px-6 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20"
                            >
                                <FaTrash /> Delete Event
                            </button>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-transparent border border-white/20 text-slate-300 font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <GlowingButton
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Updating...' : <>Update Event <FaCheck /></>}
                                </GlowingButton>
                            </div>
                        </div>

                    </form>
                </div>
            </GlassCard>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action will permanently remove it from the platform."
                type="danger"
                isLoading={isLoading}
            />

        </div>
    );
};

export default EditEvent;
