import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt, FaInfoCircle, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { GlassCard, PremiumInput, GlowingButton } from '../components/ui/PremiumComponents';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    // User validation check
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'organizer') {
        window.location.href = '/';
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Music',
        date: '',
        time: '',
        price: '',
        ticketLimit: '',
        image: null,
        imgPreview: null
    });

    const { title, description, date, time, location, category, price, ticketLimit, imgPreview } = formData;

    const onChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            if (file) {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imgPreview: URL.createObjectURL(file)
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const eventData = new FormData();

        Object.keys(formData).forEach(key => {
            if (key !== 'imgPreview') {
                eventData.append(key, formData[key]);
            }
        });

        try {
            await axios.post('http://localhost:5000/api/events', eventData, config);
            toast.success('Event Published Successfully! 🚀');
            navigate('/events');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white font-heading">Event Details</h2>
                            <p className="text-slate-400">Let's start with the basics.</p>
                        </div>
                        <PremiumInput icon={FaTag} name="title" value={title} onChange={onChange} placeholder="Event Title (e.g., Neon Music Fest)" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />

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
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white font-heading">Date & Time</h2>
                            <p className="text-slate-400">When is it happening?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PremiumInput icon={FaCalendarAlt} type="date" name="date" value={date} onChange={onChange} required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 [color-scheme:dark]" />
                            <PremiumInput icon={FaCalendarAlt} type="time" name="time" value={time} onChange={onChange} required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400 [color-scheme:dark]" />
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white font-heading">Tickets & Media</h2>
                            <p className="text-slate-400">Final touches.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PremiumInput icon={FaTag} type="number" name="price" value={price} onChange={onChange} placeholder="Price (₹)" min="0" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />
                            <PremiumInput icon={FaTicketAlt} type="number" name="ticketLimit" value={ticketLimit} onChange={onChange} placeholder="Total Tickets" min="1" required className="!bg-black/20 !border-white/10 !text-white placeholder:!text-slate-400" />
                        </div>

                        <div className="mt-4">
                            <label className="block w-full cursor-pointer group">
                                <div className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${imgPreview ? 'border-orange-500 bg-orange-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                                    {imgPreview ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white font-bold">Change Image</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaImage className="w-10 h-10 text-slate-400 mb-3 group-hover:text-orange-500 transition-colors" />
                                            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-white">Click to upload</span> event banner</p>
                                            <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                        </div>
                                    )}
                                </div>
                                <input name="image" type="file" className="hidden" onChange={onChange} accept="image/*" />
                            </label>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 relative overflow-hidden flex items-start justify-center pt-32">

            <GlassCard className="max-w-xl w-full relative z-10 !p-0 overflow-hidden !bg-slate-900/60 backdrop-blur-3xl !border-white/10 shadow-2xl">
                {/* Progress Bar */}
                <div className="bg-white/10 h-2 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    ></motion.div>
                </div>

                <div className="p-8 sm:p-10">
                    <form onSubmit={onSubmit}>
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-2">
                                    <FaArrowLeft /> Back
                                </button>
                            ) : <div></div>}

                            {step < 3 ? (
                                <GlowingButton type="button" onClick={nextStep} className="px-8 py-3 rounded-xl flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
                                    Next Step <FaArrowRight />
                                </GlowingButton>
                            ) : (
                                <GlowingButton type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl flex items-center gap-2 bg-green-600 hover:bg-green-700">
                                    {isLoading ? 'Publishing...' : <>Publish Event <FaCheck /></>}
                                </GlowingButton>
                            )}
                        </div>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
};

export default CreateEvent;
