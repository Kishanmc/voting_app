const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddlewarre");
const { vote, getResults ,addCandidate,getAllCandidates, deleteCandidateById } = require("../controllers/candidatecontrollers");


router.post("/vote", auth, vote);
router.get("/results", auth, getResults);
router.post("/add", auth, addCandidate); 

router.get("/candidates", auth, getAllCandidates); 
router.delete("/delete/:candidateId", auth, deleteCandidateById);
module.exports = router;
