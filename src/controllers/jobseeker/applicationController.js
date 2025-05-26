const JobPost = require('../../database/models/JobPost');
const Application = require('../../database/models/Application');
const { v4: uuidv4 } = require("uuid");
const bucket = require('../../config/firebase');



const createApplication = async (req, res) => {
    try {
    const { job_post_id, job_seeker_id, cover_letter } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "CV file is required" });
    }

    // Check if job post exists
    const jobPostExists = await JobPost.findById(job_post_id);
    if (!jobPostExists) {
      return res.status(404).json({ success: false, message: "Job post not found" });
    }

    // Check if already applied
    const existsApplication = await Application.findOne({ job_post_id, job_seeker_id });
    if (existsApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    // Upload CV lên Firebase Storage
    const timestamp = Date.now();
    const fileName = `cv_files/cv_${timestamp}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const uuid = uuidv4(); // tạo token public access

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        }
      }
    });

    const cvUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

    const application = new Application({
      job_post_id,
      job_seeker_id,
      cover_letter,
      cv_url: cvUrl,
    });

    await application.save();
    res.status(201).json({ success: true, message: "Application submitted successfully" });

  } catch (error) {
    console.error("Error creating application: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const getAppliedJobs = async (req, res) => {
    try {
        // Get job_seeker_id from authenticated user
        const {job_seeker_id} = req.params;
        console.log("Job Seeker ID: ", job_seeker_id);
        
        if (!job_seeker_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Find all applications by this job seeker
        const applications = await Application.find({ job_seeker_id })
            .sort({ createdAt: -1 }) // Most recent applications first
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'job_post_id',
                select: 'title company_id location salary skills job_type  status',
                populate: {
                    path: 'company_id',
                    select: 'name logo'
                }
            });
            
        // Get total count for pagination
        const total = await Application.countDocuments({ job_seeker_id });
        
        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            applications: applications.map(app => ({
                application_id: app._id,
                status: app.status,
                applied_date: app.createdAt,
                job: app.job_post_id,
                cv_url: app.cv_url,
                cover_letter: app.cover_letter
            }))
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching applied jobs",
            error: error.message
        });
    }
};

module.exports = { 
    createApplication,
    getAppliedJobs
};