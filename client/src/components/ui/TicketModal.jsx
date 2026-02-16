
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { FaDownload, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { GlowingButton } from './PremiumComponents';

const TicketModal = ({ isOpen, onClose, event, bookingId, user }) => {
    const ticketRef = useRef(null);

    const handleDownload = async () => {
        if (!ticketRef.current) return;

        try {
            // Create custom canvas with willReadFrequently attribute
            const canvas = document.createElement('canvas');
            canvas.width = ticketRef.current.scrollWidth * 2;
            canvas.height = ticketRef.current.scrollHeight * 2;
            canvas.getContext('2d', { willReadFrequently: true });

            const result = await html2canvas(ticketRef.current, {
                backgroundColor: null,
                scale: 2,
                canvas: canvas
            });

            const image = result.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `EventTicket-${event.title.replace(/\s+/g, '-')}.png`;
            link.click();
        } catch (err) {
            console.error("Ticket generation failed", err);
        }
    };

    if (!isOpen || !event) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="relative w-full max-w-md bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Visual Ticket - This part gets downloaded */}
                    <div
                        ref={ticketRef}
                        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
                    >
                        {/* Decorative Circles */}
                        <div className="absolute -left-6 top-1/2 w-12 h-12 bg-[#0F172A] rounded-full transform -translate-y-1/2"></div>
                        <div className="absolute -right-6 top-1/2 w-12 h-12 bg-[#0F172A] rounded-full transform -translate-y-1/2"></div>

                        {/* Status Banner */}
                        <div className="bg-green-600/20 py-2 border-b border-white/5 flex items-center justify-center gap-2 text-green-400 font-bold tracking-wider uppercase text-sm">
                            <FaCheckCircle /> Confirmed Ticket
                        </div>

                        {/* Event Image Banner */}
                        <div className="h-40 relative">
                            <img
                                src={event.image || 'https://via.placeholder.com/500x200'}
                                className="w-full h-full object-cover"
                                alt="Event Banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <span className="text-orange-400 text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                    {event.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-6">
                            <h2 className="text-2xl font-bold text-white mb-6 font-heading leading-tight">
                                {event.title}
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-orange-500 mt-1">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold text-gray-400">Date & Time</p>
                                        <p className="text-white font-medium">
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-red-500 mt-1">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold text-gray-400">Location</p>
                                        <p className="text-white font-medium">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Footer / QR */}
                            <div className="flex gap-6 pt-6 border-t border-dashed border-white/10">
                                <div className="bg-white p-2 rounded-xl">
                                    <QRCodeCanvas value={`BOOKING-${bookingId}`} size={80} level={"H"} />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Pass Holder</p>
                                    <p className="text-white font-bold text-2xl mb-1 capitalize leading-normal break-words">{user?.name || 'Guest User'}</p>
                                    <p className="text-[10px] text-slate-600">Scan at entrance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-4">
                        <GlowingButton
                            onClick={handleDownload}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                        >
                            <FaDownload className="mr-2" /> Download Ticket
                        </GlowingButton>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TicketModal;
