const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  date_of_birth: { type: Date },
  avatar_url: { type: String },
  skills: { type: [String] },
  experience: { type: Number },
  saved_job: { type: [mongoose.Schema.Types.ObjectId], ref: "JobPost" },
  saved_company: { type: [mongoose.Schema.Types.ObjectId], ref: "Company" },
  my_cv: { type: mongoose.Schema.Types.ObjectId, ref: "CVResume" },

});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);