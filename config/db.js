require('dotenv').config();
const mongoose = require('mongoose')

function connectDB(){
  const mongoURL = process.env.MONGO_CONNECTION_URL;
  
  if (!mongoURL) {
    console.error('MONGO_CONNECTION_URL is not defined in environment variables');
    return;
  }

  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err.message}`);
  });

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
}

module.exports = connectDB;

