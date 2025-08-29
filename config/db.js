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
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err.message}`);
  });
}

module.exports = connectDB;

