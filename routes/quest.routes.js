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

// PATCH /api/quests/:questId -- update quest name
router.patch("/quests/:questId", isAuthenticated, (req, res, next) => {
  const { questId } = req.params;
  const { name } = req.body;

  Quest.findByIdAndUpdate(questId, { $set: { name: name } }, { new: true })
    .then((updatedQuest) => {
      res.status(200).json(updatedQuest);
    })
    .catch((error) => {
      console.log("Error updating name of quest");
      console.log(error);
      res.status(500).json({ message: "Error updating name of quest" });
    });
});

// DELETE /api/quests/:questId -- delete quest
router.delete("/quests/:questId", isAuthenticated, (req, res, next) => {
  const { questId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Quest.findByIdAndDelete(questId)
    .then(() => {
      res.json({ message: `Succesful delete on quest id: ${questId}` });
    })
    .catch((error) => {
      console.log("Error while deleting the project", error);
      res.status(500).json({ message: "Error while deleting the project" });
    });
});

module.exports = router;
