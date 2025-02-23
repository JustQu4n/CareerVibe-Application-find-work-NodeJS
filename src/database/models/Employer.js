const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
});

module.exports = mongoose.model("Employer", employerSchema);