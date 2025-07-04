const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Voter = require("../models/votermodel");
const jwt = require("jsonwebtoken");


const register = asyncHandler(async (req, res) => {
  const { user, password, role, voterid, adminid, name, email, phone, dob, gender, address } = req.body;

  if (!user || !password || !role || !name || !name.first) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  // For voters
  if (role === "voter") {
    if (!voterid) return res.status(400).json({ error: "Voter ID is required" });

    const existingVoter = await Voter.findOne({ voterid });
    if (existingVoter) return res.status(400).json({ error: "Voter ID already in use" });
  }

  // For admins
  if (role === "admin") {
    if (!adminid) return res.status(400).json({ error: "Admin ID is required" });

    const existingAdmin = await Voter.findOne({ adminid });
    if (existingAdmin) return res.status(400).json({ error: "Admin ID already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const voter = await Voter.create({
    username: user,
    password: hashed,
    role,
    name,
    email,
    phone,
    dob,
    gender,
    address,
    voterid: role === "voter" ? voterid : undefined,
    adminid: role === "admin" ? adminid : undefined
  });

  res.status(201).json({
    message: `${role === "admin" ? "Admin" : "Voter"} registered successfully`,
    user: {
      username: voter.username,
      role: voter.role,
      id: role === "voter" ? voter.voterid : voter.adminid
    }
  });
});

// 🔐 Login
const login = asyncHandler(async (req, res) => {
  const { user, password, role } = req.body;

  let user_details;
  if (role === "admin") {
    user_details = await Voter.findOne({ adminid: user, role: "admin" });
    if (!user_details) return res.status(400).json({ error: "Admin not found" });
  } else if (role === "voter") {
    user_details = await Voter.findOne({ voterid: user, role: "voter" });
    if (!user_details) return res.status(400).json({ error: "Voter not found" });
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  const isMatch = await bcrypt.compare(password, user_details.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

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
      adminid: user_details.adminid || null,
      hasVoted: user_details.hasVoted ?? null,
      age: user_details.age,
    }
  });
});

module.exports = {
  register,
  login,
};
