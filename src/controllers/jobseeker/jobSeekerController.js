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


module.exports = { getJobSeekerById, updateJobSeekerProfile, deleteJobSeekerProfile, getAllJobApplications };