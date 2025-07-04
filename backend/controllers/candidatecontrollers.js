const Candidate = require("../models/candidatemodel");
const User = require("../models/votermodel");

// Cast a vote
exports.vote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.hasVoted) return res.status(400).json({ message: "You have already voted" });

    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.votes += 1;
    await candidate.save();

    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error recording vote" });
  }
};

// Get election results
exports.getResults = async (req, res) => {
  const candidates = await Candidate.find().sort({ votes: -1 });
  res.json(candidates);
};

// Add candidate
exports.addCandidate = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name, party, age, qualification, biography, imageUrl } = req.body;
  if (!name || !name.first) {
    return res.status(400).json({ message: "Candidate name required" });
  }

  const candidate = await Candidate.create({
    name,
    party,
    age,
    qualification,
    biography,
    imageUrl
  });

  res.json({ message: "Candidate added", candidate });
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().select("candidateId name party votes");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// Delete candidate by ID
exports.deleteCandidateById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { candidateId } = req.params;
    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await Candidate.deleteOne({ candidateId });
    res.status(200).json({ message: `Candidate ${candidate.name.first} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
};

// Search candidates by name
exports.searchCandidates = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query missing" });

  const regex = new RegExp(q, "i");
  const candidates = await Candidate.find({
    $or: [
      { "name.first": regex },
      { "name.surname": regex },
      { "name.last": regex }
    ]
  });

  res.json(candidates);
};

// Search voters by name
exports.searchVoters = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query missing" });

  const regex = new RegExp(q, "i");
  const voters = await User.find({
    $or: [
      { "name.first": regex },
      { "name.surname": regex },
      { "name.last": regex }
    ]
  });

  res.json(voters);
};
