const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const candidateSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, index: true },
    surname: { type: String, index: true },
    last: { type: String, index: true }
  },
  party: { type: String },
  dob: { type: Date },
  age: { type: Number }, // Calculated from dob
  qualification: { type: String },
  biography: { type: String },
  imageUrl: { type: String },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

candidateSchema.plugin(AutoIncrement, { inc_field: "candidateId" });

candidateSchema.index({ "name.first": 1, "name.surname": 1, "name.last": 1 });

candidateSchema.pre("save", function (next) {
  if (this.dob) {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

module.exports = mongoose.model("Candidate", candidateSchema);
