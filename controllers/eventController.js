const Event = require('../models/event');

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