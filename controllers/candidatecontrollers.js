const Candidate = require("../models/candidatemodel");
const User = require("../models/votermodel");
exports.vote = async (req, res) => {
  try {
    const { candidateId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.hasVoted) return res.status(400).json({ message: "You have already voted" });

    const candidate = await Candidate.findOne({ candidateId: candidateId });
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

exports.getResults = async (req, res) => {
  const candidates = await Candidate.find().sort({ votes: -1 });
  res.json(candidates);
};



exports.addCandidate = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name } = req.body;
  const candidate = await Candidate.create({ name });
  res.json({ message: "Candidate added", candidate });
};



exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().select("candidateId name votes");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

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

    res.status(200).json({ message: `Candidate ${candidate.name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
};
