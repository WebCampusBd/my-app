require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("db is connected");
  } catch (error) {
    console.log(error.message);
    console.log("db is not connected");
    process.exit(1);
  }
};

module.exports = dbConnect;
