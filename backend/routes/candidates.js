const express = require("express");
const router = express.Router();

const { 
  vote, 
  getResults, 
  addCandidate, 
  getAllCandidates, 
  deleteCandidateById, 
  searchCandidates 
} = require("../controllers/candidatecontrollers");

const auth = require("../middleware/authmiddlewarre"); // ✅ fixed typo

// Cast a vote (voter)
router.post("/vote", auth, vote);

// View election results (voter or admin)
router.get("/results", auth, getResults);

// Add candidate (admin only)
router.post("/add", auth, addCandidate);

// View all candidates (voter or admin)
router.get("/candidates", getAllCandidates);

// Delete candidate by ID (admin only)
router.delete("/delete/:candidateId", auth, deleteCandidateById);

// Search candidates by name (voter or admin)
router.get("/search", searchCandidates);

module.exports = router;
