const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // process.env.MONGO_URI hamari .env file se local database ka connection string uthaye ga
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Agar database connect na ho to server ko stop kar do
  }
};

module.exports = connectDB;
