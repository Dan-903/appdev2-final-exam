const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');

// Public: Fetch all events
router.get('/', eventController.getAllEvents);

// Protected: Create a new event
router.post('/', auth, eventController.createEvent);

// Protected: Fetch events created by the logged-in user
router.get('/my-events', auth, eventController.getMyEvents);

module.exports = router;