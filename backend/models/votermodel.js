const mongoose = require("mongoose");

const voterschema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, index: true },
    surname: { type: String, index: true },
    last: { type: String, index: true }
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  voterid: { type: String, unique: true, sparse: true },   // required for voters
  adminid: { type: String, unique: true, sparse: true },   // required for admins
  email: String,
  phone: String,
  dob: Date,
  gender: String,
  address: String,
  age: Number,
  hasVoted: { type: Boolean, default: false },
  role: { type: String, enum: ["voter", "admin"], default: "voter" }
});

// Calculate age from dob before saving
voterschema.pre("save", function (next) {
  if (this.dob) {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    this.age = age;
  }
  next();
});

module.exports = mongoose.model("Voter", voterschema);
