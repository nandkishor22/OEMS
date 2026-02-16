const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
} = require('../controllers/eventController');

const { protect, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// Get logged in user's events - MUST be before /:id route
router.get('/my-events', protect, authorize('organizer', 'admin'), getMyEvents);

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer', 'admin'), upload.single('image'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
