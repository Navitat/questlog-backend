const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Quest = require("../models/Quest.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/quests - create quest
router.post("/quests", isAuthenticated, (req, res, next) => {
  const { name, skillId } = req.body;
  const userId = req.payload._id;

  Quest.create({ name, skillId, userId })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log("Error while creating the quest");
      next(error);
    });
});

module.exports = router;
