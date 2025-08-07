const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const LEVEL_EXP = require("../utils/levelExp");

// GET /api/user/
router.get("/user", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    })
    .catch((error) => {
      console.log("Error retrieving user");
      next(error);
    });
});

// POST /api/user/disciplines -- create disciplines
router.post("/user/disciplines", isAuthenticated, (req, res, next) => {
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

// PATCH /api/user/disciplines/:disciplineId/complete - complete discipline
router.patch(
  "/user/disciplines/:disciplineId/complete",
  isAuthenticated,
  (req, res, next) => {
    const { disciplineId } = req.params;
    const userId = req.payload._id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        const discipline = user.disciplines.id(disciplineId);
        if (!discipline) {
          res.status(404).json({ message: "Discipline not found" });
          return;
        }

        //get exp from doc
        const { givenExp, skillId } = discipline;
        const skill = user.skills.id(skillId);
        if (!skill) {
          res.status(404).json({ message: "Associated skill not found" });
        }

        // apply exp to skill
        skill.experience += givenExp;
        while (skill.experience >= (skill.level + 1) * LEVEL_EXP) {
          skill.experience -= (skill.level + 1) * LEVEL_EXP;
          skill.level += 1;
        }

        // apply exp to user
        user.experience += givenExp;
        while (user.experience >= user.level * LEVEL_EXP) {
          user.experience -= user.level * LEVEL_EXP;
          user.level += 1;
        }

        discipline.completed = true;
        discipline.lastCompletedAt = new Date();

        return user.save();
      })
      .then((updatedUser) => {
        const discipline = updatedUser.disciplines.id(disciplineId);
        const skill = updatedUser.skills.id(discipline.skillId);

        res.status(200).json({
          message: "Discipline completed and EXP applied",
          userLevel: updatedUser.level,
          userExp: updatedUser.experience,
          skillName: skill.name,
          skillLevel: skill.level,
          skillExp: skill.experience,
          streak: discipline.streak,
          complete: discipline.complete,
        });
      })
      .catch((error) => {
        console.log("Error while completing discipline");
        console.log(error);
        res.status(505).json({ message: "Error while completing discipline" });
      });
  }
);

// POST /api/user/skills -- create skills
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
