const Event = require('../models/event');
const User = require('../models/user');
const pug = require('pug');
const path = require('path');
const transporter = require('../config/nodemailer');

// Fetch all events (public)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('userId', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new event (protected)
exports.createEvent = async (req, res) => {
  try {
    const { title, location, date, description } = req.body;

    // Validate required fields
    if (!title || !location || !date || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const event = new Event({
      title,
      location,
      date,
      description,
      userId: req.user.userId
    });

    await event.save();

    // Fetch user details for email
    let user;
    try {
      user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
    } catch (userErr) {
      return res.status(500).json({ message: 'Error fetching user details.' });
    }

    // Compile Pug template
    let html;
    try {
      html = pug.renderFile(
        path.join(__dirname, '../emails/eventCreated.pug'),
        {
          name: user.name,
          title,
          date: new Date(date).toLocaleString(),
          location
        }
      );
    } catch (pugErr) {
      return res.status(500).json({ message: 'Error rendering email template.' });
    }

    // Send email using the shared transporter
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Event Created: ' + title,
        html
      });
    } catch (mailErr) {
      // Log the error but do not fail the event creation
      console.error('Email sending failed:', mailErr);
      return res.status(500).json({ message: 'Event created, but failed to send confirmation email.' });
    }

    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: 'Server error during event creation.' });
  }
};

// Fetch events created by the logged-in user (protected)
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};