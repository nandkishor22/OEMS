const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getOrganizerStats } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.get('/organizer-stats', protect, authorize('organizer', 'admin'), getOrganizerStats);

module.exports = router;
