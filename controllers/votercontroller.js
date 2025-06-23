const bcrypt= require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Voter = require("../models/votermodel");
const  jwt = require("jsonwebtoken");


const register = asyncHandler(async (req, res) => {
  const { user, password, role, voterid } = req.body;

  if (role === "admin") {
    const adminExists = await Voter.findOne({ username: user });
    if (adminExists) {
      return res.status(400).json({ error: "Admin already exists" });
    }
  }

  // For voters, voterid is mandatory and must be unique
  if (role === "voter") {
    if (!voterid) {
      return res.status(400).json({ error: "Voter ID is required for voters" });
    }

    const existingVoter = await Voter.findOne({ voterid });
    if (existingVoter) {
      return res
        .status(400)
        .json({ error: "Voter already registered with this voter ID" });
    }
  }

  const hashed = await bcrypt.hash(password, 10);

  const voter = await Voter.create({
    username: user,
    password: hashed,
    role,
    voterid: voterid || null, // if role is admin, voterid will be null
  });

  res.status(201).json(voter);
});



const login = asyncHandler(async (req, res) => {
  const { user, password, role } = req.body;

  let user_details;

  if (role === "admin") {
   
    user_details = await Voter.findOne({ username: user, role: "admin" });
    if (!user_details) {
      return res.status(400).json({ error: "Admin not found" });
    }
  } else if (role === "voter") {
   
    user_details = await Voter.findOne({ voterid: user, role: "voter" });
    if (!user_details) {
      return res.status(400).json({ error: "Voter not found" });
    }
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  const isMatch = await bcrypt.compare(password, user_details.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user_details._id,
      role: user_details.role,
      username: user_details.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  
  res.json({
    message: "Login successful",
    token,
    user: {
      username: user_details.username,
      role: user_details.role,
      voterid: user_details.voterid || null,
      hasVoted: user_details.hasVoted ?? null,
    },
  });
});

module.exports = {
  register,
  login,
};