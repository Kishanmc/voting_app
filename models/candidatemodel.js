const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const candidateSchema = new mongoose.Schema({
  name: String,

  votes: { type: Number, default: 0 },
});

candidateSchema.plugin(AutoIncrement, { inc_field: "candidateId" });
module.exports = mongoose.model("Candidate", candidateSchema);
