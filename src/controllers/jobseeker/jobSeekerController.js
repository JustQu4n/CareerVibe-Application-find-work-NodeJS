const JobSeeker = require('../../database/models/JobSeeker'); 

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


module.exports = { getJobSeekerById, updateJobSeekerProfile, deleteJobSeekerProfile };