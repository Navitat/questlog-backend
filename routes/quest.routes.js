const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Quest = require("../models/Quest.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const LEVEL_EXP = require("../utils/levelExp");

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

// PATCH /api/quests/:questId -- complete quest
router.patch("/quests/:questId/complete", isAuthenticated, async (req, res) => {
  const { questId } = req.params;
  const userId = req.payload._id;

  try {
    const quest = await Quest.findById(questId);
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    const { givenExp, skillId } = quest;
    if (!skillId) {
      return res.status(404).json({ message: "No associated skill found" });
    }

    // Update quest
    quest.completed = true;
    quest.archived = true;
    await quest.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skill = user.skills.id(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Associated skill not found" });
    }

    // Apply EXP to skill
    skill.experience += givenExp;
    while (skill.experience >= (skill.level + 1) * LEVEL_EXP) {
      skill.experience -= (skill.level + 1) * LEVEL_EXP;
      skill.level += 1;
    }

    // Apply EXP to user
    user.experience += givenExp;
    while (user.experience >= user.level * LEVEL_EXP) {
      user.experience -= user.level * LEVEL_EXP;
      user.level += 1;
    }

    const updatedUser = await user.save();
    const updatedSkill = updatedUser.skills.id(skillId);

    return res.status(200).json({
      message: "Quest completed and EXP applied",
      userLevel: updatedUser.level,
      userExp: updatedUser.experience,
      skillName: updatedSkill.name,
      skillLevel: updatedSkill.level,
      skillExp: updatedSkill.experience,
    });
  } catch (error) {
    console.error("Error updating quest status:", error);
    return res.status(500).json({ message: "Error updating quest status" });
  }
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
