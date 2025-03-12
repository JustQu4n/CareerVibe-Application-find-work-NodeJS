const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: { type: String, required: true },
  level: { type: String, required: true },
  salary: { type: Number },
  gender: { type: String, enum: ["male", "female", "any"], required: true },
  job_type: { type: String, enum: ["full_time", "part_time", "remote", "hybrid"], required: true },
  status: { type: String, enum: ["active", "hidden"], default: "active" },
  views: { type: Number, default: 0 },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobPost", jobPostSchema);