const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

// POST /api/users/:userId/skills
router.post("/users/:userId/skills", (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // e
      const newSkill = { name };
      user.skills.push(newSkill);

      return user.save();
    })
    .then((updatedUser) => {
      const addedSkill = updatedUser.skills[updatedUser.skills.length - 1];
      res.status(201).json(addedSkill);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error adding skill", error: error });
    });
});

module.exports = router;
