// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  discountCategory: { type: String, enum: ['Student', 'Doctor', 'Armed Forces', 'Senior Citizen', 'Regular'], required: true },
  discountAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  paymentDate: { type: Date, default: Date.now }
});

// Add a Ticket schema to generate the ticket upon successful payment
const ticketSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  ticketNumber: { type: String, required: true, unique: true },
  seatClass: { type: String, required: true },
  passengerName: { type: String, required: true },
  flightDetails: { type: String, required: true },
  issueDate: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Payment, Ticket };
