const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  avatar_url: { type: String },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  job_posts: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost" },
});

module.exports = mongoose.model("Employer", employerSchema);