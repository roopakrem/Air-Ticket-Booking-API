// controllers/paymentController.js
const { Payment, Ticket } = require('../models/Payment');
const { Flight, User } = require('../models/Flight'); // Assuming these models exist

const handlePayment = async (req, res) => {
  try {
    const { flightId, userId, amount, discountCategory, discountAmount, totalAmount } = req.body;

    // Create a payment record
    const payment = new Payment({
      flightId,
      userId,
      amount,
      discountCategory,
      discountAmount,
      totalAmount,
      paymentStatus: 'Pending'
    });

    // Save the payment record
    await payment.save();

    // Simulate the completion of payment (this can be integrated with payment gateways)
    payment.paymentStatus = 'Completed'; // Update status after successful payment
    payment.paymentDate = new Date();
    await payment.save();

    // After successful payment, generate a ticket
    const ticket = new Ticket({
      paymentId: payment._id,
      ticketNumber: `TICKET-${Math.floor(Math.random() * 1000000)}`, // Generate unique ticket number
      seatClass: 'Economy', // You could make this dynamic based on user input
      passengerName: 'John Doe', // Passengers' names can be dynamically added based on booking details
      flightDetails: `Flight ID: ${flightId}`, // Simple flight reference, should ideally pull more details from Flight model
    });

    // Save the generated ticket
    await ticket.save();

    // Return payment and ticket details as a response
    res.json({
      message: 'Payment successful, and ticket has been generated.',
      payment,
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing payment or generating ticket.' });
  }
};

// Ticket download logic (converting ticket to PDF)
const downloadTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Convert ticket data to PDF (You can use a library like `pdfkit` or `puppeteer` for this)
    // Here's a basic setup with a mock PDF generator
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket-${ticket.ticketNumber}.pdf"`);

    doc.pipe(res);
    doc.fontSize(12).text(`Ticket Number: ${ticket.ticketNumber}`);
    doc.text(`Passenger Name: ${ticket.passengerName}`);
    doc.text(`Flight Details: ${ticket.flightDetails}`);
    doc.text(`Seat Class: ${ticket.seatClass}`);
    doc.text(`Issued On: ${ticket.issueDate}`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error downloading ticket.' });
  }
};

module.exports = { handlePayment, downloadTicket };
