require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('./models/user');
const Event = require('./models/event');

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'secret123';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Connected to MongoDB');

    // Clear collections
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared users and events');

    // Seed users
    const users = [];
    for (let i = 0; i < 5; i++) {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
  const user = new User({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword
  });
  users.push(await user.save());
}
    console.log('Seeded users');

    // Seed events
    for (let i = 0; i < 10; i++) {
  const randomUser = users[Math.floor(Math.random() * users.length)];
  await Event.create({
    title: faker.lorem.words(3),
    location: faker.location.city(),
    date: faker.date.future(),
    description: faker.lorem.sentences(2),
    userId: randomUser._id
  });
}
    console.log('Seeded events');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();