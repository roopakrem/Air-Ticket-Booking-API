const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    airlineName: { type: String, required: true, unique: true },
    airlineCode: { type: String, required: true, unique: true },  // Unique airline code
    logo: { type: String, required: true },
    email: { type: String,  required: true},
    password: { type: String , required: true},
    phone: { type: String, required: true },
    address: { type: String, required: true },
    flights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight'}],  // Reference to flights by this airline
    seatClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SeatClass', required: true }],  // Reference to seat classes offered
    createdOn: { type: Date, default: Date.now},
    active: { type: Boolean, default: true },  // To track whether the airline is active
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
