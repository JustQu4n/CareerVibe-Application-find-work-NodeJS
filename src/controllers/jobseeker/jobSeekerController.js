const JobSeeker = require('../../database/models/JobSeeker'); 
const Application = require('../../database/models/Application');
const JobPost = require('../../database/models/JobPost');

const getJobSeekerById = async (req, res) => {
    try {
        const jobSeekerId = req.params.id;
        const jobSeeker = await JobSeeker.findById(jobSeekerId).populate('user_id');
        if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
          }
        res.status(200).json(jobSeeker);
    } catch (error) {
        console.error("Error fetching job posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateJobSeekerProfile = async (req, res) => {
    try {
        const jobSeekerId = req.params.id;
        const updatedData = req.body;
        const file = req.file;

        const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(jobSeekerId, updatedData, { new: true });
        if (!updatedJobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }
        res.status(200).json(updatedJobSeeker);
    } catch (error) {
        console.error("Error updating job seeker profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteJobSeekerProfile = async (req, res) => {
    try {
        const jobSeekerId = req.params.id;

        const deletedJobSeeker = await JobSeeker.findByIdAndDelete(jobSeekerId);
        if (!deletedJobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }
        res.status(200).json({ message: "JobSeeker profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting job seeker profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllJobApplications = async (req, res) => {
    try {
        const jobSeekerId = req.params.id;

        const applications = await Application.find({ job_seeker_id: jobSeekerId }).populate('job_post_id');
        if (!applications) {
            return res.status(404).json({ message: "No applications found for this job seeker" });
        }
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Lưu một công việc vào danh sách yêu thích
 * @route POST /api/jobseeker/save-job
 */
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        // Kiểm tra job post tồn tại
        const jobExists = await JobPost.findById(jobId);
        if (!jobExists) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Tìm jobseeker profile
        const jobSeeker = await JobSeeker.findOne({ user_id: userId });
        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        // Kiểm tra xem job đã được lưu chưa
        if (jobSeeker.saved_job.includes(jobId)) {
            return res.status(400).json({ success: false, message: "Job already saved" });
        }

        // Thêm job vào saved_job
        jobSeeker.saved_job.push(jobId);
        await jobSeeker.save();

        return res.status(200).json({
            success: true,
            message: "Job saved successfully",
            data: jobSeeker.saved_job
        });
    } catch (error) {
        console.error("Error saving job:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Xóa một công việc khỏi danh sách yêu thích
 * @route DELETE /api/jobseeker/unsave-job/:jobId
 */
const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        // Tìm jobseeker profile
        const jobSeeker = await JobSeeker.findOne({ user_id: userId });
        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        // Kiểm tra xem job có trong saved_job không
        if (!jobSeeker.saved_job.includes(jobId)) {
            return res.status(400).json({ success: false, message: "Job not saved" });
        }

        // Xóa job khỏi saved_job
        jobSeeker.saved_job = jobSeeker.saved_job.filter(id => id.toString() !== jobId);
        await jobSeeker.save();

        return res.status(200).json({
            success: true,
            message: "Job removed from saved list",
            data: jobSeeker.saved_job
        });
    } catch (error) {
        console.error("Error unsaving job:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Lấy danh sách công việc đã lưu
 * @route GET /api/jobseeker/saved-jobs
 */
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // Tìm jobseeker profile và populate saved_job
        const jobSeeker = await JobSeeker.findOne({ user_id: userId }).populate({
            path: 'saved_job',
            select: 'title company_name location job_type salary status created_at',
            populate: {
                path: 'company_id',
                select: 'name logo'
            }
        });

        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        return res.status(200).json({
            success: true,
            count: jobSeeker.saved_job.length,
            data: jobSeeker.saved_job
        });
    } catch (error) {
        console.error("Error getting saved jobs:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Lưu một công ty vào danh sách yêu thích
 * @route POST /api/jobseeker/save-company
 */
const saveCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        const userId = req.user.id;

        if (!companyId) {
            return res.status(400).json({ success: false, message: "Company ID is required" });
        }

        // Kiểm tra company tồn tại
        const companyExists = await Company.findById(companyId);
        if (!companyExists) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Tìm jobseeker profile
        const jobSeeker = await JobSeeker.findOne({ user_id: userId });
        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        // Kiểm tra xem company đã được lưu chưa
        if (jobSeeker.saved_company.includes(companyId)) {
            return res.status(400).json({ success: false, message: "Company already saved" });
        }

        // Thêm company vào saved_company
        jobSeeker.saved_company.push(companyId);
        await jobSeeker.save();

        return res.status(200).json({
            success: true,
            message: "Company saved successfully",
            data: jobSeeker.saved_company
        });
    } catch (error) {
        console.error("Error saving company:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Xóa một công ty khỏi danh sách yêu thích
 * @route DELETE /api/jobseeker/unsave-company/:companyId
 */
const unsaveCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const userId = req.user.id;

        // Tìm jobseeker profile
        const jobSeeker = await JobSeeker.findOne({ user_id: userId });
        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        // Kiểm tra xem company có trong saved_company không
        if (!jobSeeker.saved_company.includes(companyId)) {
            return res.status(400).json({ success: false, message: "Company not saved" });
        }

        // Xóa company khỏi saved_company
        jobSeeker.saved_company = jobSeeker.saved_company.filter(id => id.toString() !== companyId);
        await jobSeeker.save();

        return res.status(200).json({
            success: true,
            message: "Company removed from saved list",
            data: jobSeeker.saved_company
        });
    } catch (error) {
        console.error("Error unsaving company:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Lấy danh sách công ty đã lưu
 * @route GET /api/jobseeker/saved-companies
 */
const getSavedCompanies = async (req, res) => {
    try {
        const userId = req.user.id;

        // Tìm jobseeker profile và populate saved_company
        const jobSeeker = await JobSeeker.findOne({ user_id: userId }).populate({
            path: 'saved_company',
            select: 'name logo industry location size description'
        });

        if (!jobSeeker) {
            return res.status(404).json({ success: false, message: "JobSeeker profile not found" });
        }

        return res.status(200).json({
            success: true,
            count: jobSeeker.saved_company.length,
            data: jobSeeker.saved_company
        });
    } catch (error) {
        console.error("Error getting saved companies:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Cập nhật exports
module.exports = { 
    getJobSeekerById, 
    updateJobSeekerProfile, 
    deleteJobSeekerProfile, 
    getAllJobApplications,
    saveJob,
    unsaveJob,
    getSavedJobs,
    saveCompany,
    unsaveCompany,
    getSavedCompanies
};