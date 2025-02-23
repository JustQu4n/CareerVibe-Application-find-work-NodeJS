const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job_post_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true },
  job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
  status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
  applied_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);