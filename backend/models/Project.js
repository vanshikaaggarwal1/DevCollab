const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    techStack: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile App",
        "AI / ML",
        "Cyber Security",
        "Blockchain",
        "Game Development",
      ],
    },

    teamSize: {
      type: Number,
      default: 1,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    github: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },

    owner: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    status: {
      type: String,
      enum: ["Planning", "Active", "Completed"],
      default: "Planning",
    },

    pendingRequests: [
      {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },


    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);