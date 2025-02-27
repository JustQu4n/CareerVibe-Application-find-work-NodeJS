const JobPost = require('../database/models/JobPost');
const Application = require('../database/models/Application');



const createApplication = async (req, res) => {
    try {
        
        const { job_post_id, job_seeker_id, cover_letter } = req.body;
        const cvFile = req.file;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "CV file is required" });
          }
        // Check if job post exists
        const jobPostExists = await JobPost.findById(job_post_id);
        if (!jobPostExists) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Check if the job seeker has already applied for this job
        const existsApplication = await Application.findOne({ job_post_id, job_seeker_id });
        if (existsApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job" });
        }

        // Create a new application
        const application = new Application({
            job_post_id,
            job_seeker_id,
            cover_letter,
            cv_url: cvFile.path,
        });
        await application.save();
        res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
        console.error("Error creating application: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createApplication };