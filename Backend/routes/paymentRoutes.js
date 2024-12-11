// routes/paymentRoutes.js
const express = require('express');
const { handlePayment, downloadTicket } = require('../controllers/paymentController');
const router = express.Router();

// Route for handling payment submission
router.post('/process-payment', handlePayment);

// Route for downloading ticket as PDF
router.get('/download-ticket/:id', downloadTicket);

module.exports = router;
