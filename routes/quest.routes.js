const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Quest = require("../models/Quest.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /api/quests -- get quests
router.get("/quests", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  Quest.find({ userId: userId })
    .then((quests) => {
      res.status(200).json(quests);
    })
    .catch((error) => {
      console.log("Error retrieving quests");
      next(error);
    });
});

// POST /api/quests -- create quest
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
