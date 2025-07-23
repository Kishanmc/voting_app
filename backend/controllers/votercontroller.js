const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Voter = require("../models/votermodel");
const jwt = require("jsonwebtoken");


exports.register = asyncHandler(async (req, res) => {
  const { user, password, role, voterid, adminid, name, email, phone, dob, gender, address } = req.body;

  if (!user || !password || !role || !name || !name.first) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const idField = role === 'voter' ? 'voterid' : 'adminid';
  const userId = role === 'voter' ? voterid : adminid;
  if (!userId) return res.status(400).json({ error: `${role} ID is required` });

  const existing = await Voter.findOne({ [idField]: userId });
  if (existing) return res.status(400).json({ error: `${role} ID already in use` });

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
    message: `${role} registered successfully`,
    user: {
      username: voter.username,
      role: voter.role,
      id: userId
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { user, password, role } = req.body;

  const criteria = role === "admin"
    ? { adminid: user, role: "admin" }
    : { voterid: user, role: "voter" };

  const user_details = await Voter.findOne(criteria);
  if (!user_details) return res.status(400).json({ error: `${role} not found` });

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
