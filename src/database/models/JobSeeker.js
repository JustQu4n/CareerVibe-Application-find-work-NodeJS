const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  date_of_birth: { type: Date },
  avatar: { type: String, default: "https://avatar.iran.liara.run/public/boy" },
  skills: { type: [String] },
  experience: { type: Number },
  bio: { type: String },
  saved_job: { type: [mongoose.Schema.Types.ObjectId], ref: "JobPost" },
  saved_company: { type: [mongoose.Schema.Types.ObjectId], ref: "Company" },
  my_cv: { type: mongoose.Schema.Types.ObjectId, ref: "CVResume" },

});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);