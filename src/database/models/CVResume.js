const mongoose = require("mongoose");

const cvResumeSchema = new mongoose.Schema({
  job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true }, 
  personal_info: {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    date_of_birth: { type: Date },
    profile_picture_url: { type: String }, 
  },
  career_objective: { type: String },
  work_experience: [
    {
      job_title: { type: String, required: true },
      company_name: { type: String, required: true },
      start_date: { type: Date, required: true },
      end_date: { type: Date }, 
      description: { type: String }, 
    },
  ],
  education: [
    {
      degree: { type: String, required: true }, 
      school_name: { type: String, required: true },
      start_date: { type: Date, required: true },
      end_date: { type: Date }, 
      description: { type: String }, 
    },
  ],
  skills: [
    {
      skill_name: { type: String, required: true }, 
      proficiency: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "intermediate" }, // Mức độ thành thạo
    },
  ],
  certifications: [
    {
      name: { type: String, required: true }, 
      issued_by: { type: String, required: true }, 
      issued_date: { type: Date, required: true },
      expiration_date: { type: Date }, 
    },
  ],
  languages: [
    {
      language_name: { type: String, required: true }, 
      proficiency: { type: String, enum: ["basic", "intermediate", "fluent", "native"], default: "intermediate" }, // Mức độ thành thạo
    },
  ],
  projects: [
    {
      project_name: { type: String, required: true }, 
      start_date: { type: Date, required: true },
      end_date: { type: Date }, 
      description: { type: String }, 
      technologies_used: [{ type: String }], 
    },
  ],
  references: [
    {
      reference_name: { type: String, required: true }, 
      position: { type: String }, 
      company: { type: String },
      phone: { type: String }, 
      email: { type: String }, 
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CVResume", cvResumeSchema);