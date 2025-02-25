const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  logo_url: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  job_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
});

module.exports = mongoose.model("Company", companySchema);