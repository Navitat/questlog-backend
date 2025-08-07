const { Schema, model } = require("mongoose");

const skillSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
});

const disciplineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["good", "bad"],
    required: true,
  },
  givenExp: {
    type: Number,
    default: 10,
  },
  streak: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastCompletedAt: {
    type: Date,
    default: null,
  },
  skillId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    hp: {
      type: Number,
      default: 100,
    },
    profileImg: {
      type: String,
      default: "https://i.imgur.com/WxNkK7J.png",
    },
    skills: [skillSchema],
    disciplines: [disciplineSchema],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
