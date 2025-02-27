const Employer = require('../../database/models/Employer'); 
const Application = require('../../database/models/Application');
const JobPost = require('../../database/models/JobPost');

const getEmployerById = async (req, res) => {
    try {
        console.log(req.params.id);
        const employerId = req.params.id;
        const employer = await Employer.findById(employerId).populate('user_id');
        console.log('em', employer);
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }
        res.status(200).json(employer);
    } catch (error) {
        console.error("Error fetching employer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateEmployerProfile = async (req, res) => {
    try {
        const employerId = req.params.id;
        const updatedData = req.body;

        const updatedEmployer = await Employer.findByIdAndUpdate(employerId, updatedData, { new: true });
        if (!updatedEmployer) {
            return res.status(404).json({ message: "Employer not found" });
        }
        res.status(200).json(updatedEmployer);
    } catch (error) {
        console.error("Error updating employer profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteEmployerProfile = async (req, res) => {
    try {
        const employerId = req.params.id;

        const deletedEmployer = await Employer.findByIdAndDelete(employerId);
        if (!deletedEmployer) {
            return res.status(404).json({ message: "Employer not found" });
        }
        res.status(200).json({ message: "Employer profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting employer profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllApplicationsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Find all job posts by the company
        const jobPosts = await JobPost.find({ company_id: companyId });
        const jobPostIds = jobPosts.map(jobPost => jobPost._id);

        // Find all applications for the job posts
        const applications = await Application.find({ job_post_id: { $in: jobPostIds } }).populate('job_post_id').populate('job_seeker_id');
        if (!applications.length) {
            return res.status(404).json({ message: "No applications found for this company" });
        }
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getEmployerById, updateEmployerProfile, deleteEmployerProfile, getAllApplicationsByCompany };    