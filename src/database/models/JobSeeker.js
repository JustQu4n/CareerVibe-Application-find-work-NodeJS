const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  cv_url: { type: String },
  skills: { type: [String] },
  experience: { type: Number },
  favorite_jobs: { type: [mongoose.Schema.Types.ObjectId], ref: "JobPost" },
});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);