const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Models
const Donor = require('./models/Donor');
const Subscriber = require('./models/Subscriber');

// --- API ROUTES ---

// 1. Submit a Donation
app.post('/api/donate', async (req, res) => {
  try {
    const donorData = req.body;
    
    // Create new donor record
    const newDonor = new Donor(donorData);
    await newDonor.save();
    
    res.status(201).json({
      success: true,
      message: 'Donation successfully registered',
      donorId: newDonor._id,
      referenceNumber: 'ZHC-2026-' + Math.floor(10000 + Math.random() * 90000)
    });
  } catch (error) {
    console.error('Error in /api/donate:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to register donation',
      error: error.message
    });
  }
});

// 2. Subscribe to Newsletter
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Check if simple subscriber exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }
    
    // Save new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    
    res.status(201).json({ success: true, message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Error in /api/subscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription',
      error: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
