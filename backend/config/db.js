const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL_LOCAL);
  console.log("MongoDB connected");
};
module.exports = connectDB;
