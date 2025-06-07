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
    const event = new Event({
      title,
      location,
      date,
      description,
      userId: req.user.userId
    });
    await event.save();

    // Fetch user details for email
    const user = await User.findById(req.user.userId);

    // Compile Pug template
    const html = pug.renderFile(
      path.join(__dirname, '../emails/eventCreated.pug'),
      {
        name: user.name,
        title,
        date: new Date(date).toLocaleString(),
        location
      }
    );

    // Send email using the shared transporter
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Event Created: ' + title,
      html
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: 'Invalid event data' });
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