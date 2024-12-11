const express = require('express');
const router = express.Router();
const Payment = require('../model/Payment');

router.post('/', async (req, res) => {
  const { flightId, userId, amount, discountCategory, discountAmount, totalAmount, paymentStatus } = req.body;

  try {
    const newPayment = new Payment({
      flightId,
      userId,
      amount,
      discountCategory,
      discountAmount,
      totalAmount,
      paymentStatus
    });
    
    await newPayment.save();
    res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record payment', error });
  }
});

module.exports = router;
