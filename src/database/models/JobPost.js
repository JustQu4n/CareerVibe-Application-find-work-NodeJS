const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number },
  job_type: { type: String, enum: ["full_time", "part_time", "remote"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobPost", jobPostSchema);