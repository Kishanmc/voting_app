const mongoose= require("mongoose");

const voterschema= new mongoose.Schema({
    username: String,
    password: String,
    voterid: String,
    hasVoted: { type: Boolean, default:false},
     role: { type: String, enum: ["voter", "admin"], default: "voter" }
});

module.exports=mongoose.model("Voter",voterschema);