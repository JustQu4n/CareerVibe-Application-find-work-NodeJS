const JobSeeker = require('../../database/models/JobSeeker'); // Adjust the path as necessary

const getJobSeekerById = async (req, res) => {
    try {
        const jobSeekerId = req.params.id;
        const jobSeeker = await JobSeeker.findById(jobSeekerId).populate('user_id');
        if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
          }
        res.status(200).json(jobSeeker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobSeekerById };