const express = require("express");
const { register, login } = require("../controllers/votercontroller");
const { searchVoters } = require("../controllers/candidatecontrollers");


const router = express.Router();

// Register and login
router.post("/register", register);
router.post("/login", login);

// Search voters by name
router.get("/search",searchVoters); // Optional auth middleware

module.exports = router;
