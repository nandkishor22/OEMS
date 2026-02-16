const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { eventId, tickets } = req.body;

        // Validate tickets
        const numTickets = Number(tickets);
        if (!numTickets || numTickets < 1) {
            return res.status(400).json({ message: 'Please specify a valid number of tickets' });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check availability
        if (event.ticketLimit - event.soldTickets < numTickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const totalAmount = event.price * numTickets;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            tickets: numTickets,
            totalAmount,
            status: 'confirmed' // Auto-confirm since we don't have payment gateway yet
        });

        if (booking) {
            // Update event sold tickets count
            event.soldTickets += numTickets;
            await event.save();

            // Emit Socket Event for Real-Time Update
            try {
                const socketUtil = require('../socket/socket');
                // Check if getIO is available and doesn't throw
                try {
                    const io = socketUtil.getIO();
                    io.emit('update_seats', {
                        eventId: event._id,
                        soldTickets: event.soldTickets,
                        remainingTickets: event.ticketLimit - event.soldTickets
                    });
                } catch (e) {
                    console.log("Socket.io not initialized yet, skipping real-time update");
                }
            } catch (socketError) {
                console.error("Socket emit failed:", socketError);
            }

            res.status(201).json(booking);
        } else {
            res.status(400).json({ message: 'Invalid booking data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event')
            .sort('-createdAt');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get organizer statistics
// @route   GET /api/bookings/organizer-stats
// @access  Private (Organizer/Admin only)
const getOrganizerStats = async (req, res) => {
    try {
        const organizerId = req.user.id;

        // 1. Get all events created by the organizer
        const events = await Event.find({ organizer: organizerId });
        const eventIds = events.map(event => event._id);

        // 2. Get total bookings for these events
        const bookings = await Booking.find({ event: { $in: eventIds }, status: 'confirmed' });

        // 3. Calculate Daily Sales Volume (Last 30 Days)
        const salesVolume = {};
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            salesVolume[date.toISOString().split('T')[0]] = 0;
        }

        bookings.forEach(booking => {
            const date = booking.createdAt.toISOString().split('T')[0];
            if (salesVolume[date] !== undefined) {
                salesVolume[date] += booking.totalAmount;
            }
        });

        const salesChartData = Object.entries(salesVolume)
            .sort((a, b) => new Date(a[0]) - new Date(b[0])) // Sort by date ascending
            .map(([date, amount]) => ({ date, amount }));

        // 4. Calculate Ticket Type Distribution (By Event Category)
        const categoryStats = {};
        events.forEach(event => {
            if (!categoryStats[event.category]) {
                categoryStats[event.category] = 0;
            }
            categoryStats[event.category] += event.soldTickets;
        });

        const categoryChartData = Object.entries(categoryStats).map(([category, count]) => ({
            category,
            count
        }));

        res.status(200).json({
            salesVolume: salesChartData,
            categoryDistribution: categoryChartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getOrganizerStats
};
