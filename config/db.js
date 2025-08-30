require('dotenv').config();
const mongoose = require('mongoose')

function connectDB(){
  const mongoURL = process.env.MONGO_CONNECTION_URL;
  
  if (!mongoURL) {
    console.error('MONGO_CONNECTION_URL is not defined in environment variables');
    return;
  }

  // If already connected, don't connect again
  if (mongoose.connection.readyState === 1) {
    console.log('Database already connected');
    return;
  }

  console.log('Attempting to connect to database...');
  
  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
  })
  .then(() => {
    console.log('Connected to database successfully');
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

