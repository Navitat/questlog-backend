const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  completed: {
    type: Boolean,
    default: false,
  },
  givenExp: {
    type: Number,
    default: 5,
  },
});

const inventorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "article", "book", "pdf", "other"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const questSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    archived: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    givenExp: {
      type: Number,
      default: 10,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [taskSchema],
    inventory: [inventorySchema],
  },
  {
    timestamps: true,
  }
);

const Quest = model("Quest", questSchema);

module.exports = Quest;
