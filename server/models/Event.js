const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add an event title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Music', 'Technology', 'Sports', 'Business', 'Arts', 'Education', 'Social', 'Other']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/800x400?text=Event+Image'
    },
    price: {
        type: Number,
        required: [true, 'Please add a ticket price'],
        default: 0
    },
    ticketLimit: {
        type: Number,
        required: [true, 'Please add ticket limit'],
        min: [1, 'Ticket limit must be at least 1']
    },
    soldTickets: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
