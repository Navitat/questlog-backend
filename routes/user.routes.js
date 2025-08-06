const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/users/disciplines -- create disciplines
router.post("/users/disciplines", isAuthenticated, (req, res, next) => {
  const { name, type, skillId } = req.body;
  const userId = req.payload._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newDiscipline = { name, type, skillId };
      user.disciplines.push(newDiscipline);

      return user.save();
    })
    .then((updatedUser) => {
      const addedDiscipline =
        updatedUser.disciplines[updatedUser.disciplines.length - 1];
      res.status(201).json(addedDiscipline);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error adding discipline", error: error });
    });
});

// POST /api/users/skills -- create skills
router.post("/users/skills", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  const { name } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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
