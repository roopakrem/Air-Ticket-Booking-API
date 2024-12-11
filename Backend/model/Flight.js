const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },  // Reference to the airline
    flightNumber: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    image: { type: String },  // URL or file path for the image/logo
    duration: { type: String },
    seatModel: { type: mongoose.Schema.Types.ObjectId, ref: 'SeatClass', required: true },  // Reference to seat class model
    luggageCapacity: { type: String },
    approved: { type: Boolean, default: false },  // Flight approval status
    status: { type: String, default: 'Awaiting Approval for Adding Flight' },  // Flight status
});

module.exports = mongoose.model('Flight', flightSchema);
