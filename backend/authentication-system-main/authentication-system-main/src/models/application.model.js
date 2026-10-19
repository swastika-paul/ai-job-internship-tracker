
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Job", "Internship"],
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    mode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      default: "Onsite",
    },

    salary: {
      type: String,
      default: "",
    },

    stipend: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Wishlist",
        "Applied",
        "Online Assessment",
        "Interview",
        "Offer",
        "Rejected",
        "Accepted",
        "Withdrawn",
      ],
      default: "Wishlist",
    },

    appliedDate: {
      type: Date,
      default: null,
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    offerDate: {
      type: Date,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    deadline: {
      type: Date,
      default: null,
    },

    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;
