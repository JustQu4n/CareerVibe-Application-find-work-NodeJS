const JobPost = require('../../database/models/JobPost');
const User = require('../../database/models/User');
const Employer = require('../../database/models/Employer');
const Company = require('../../database/models/Companies');

const createJobPost = async (req, res) => {
    try {
        const { user_id, company_id, title, description, location, salary, job_type } = req.body;
        
        //Check if the user is the owner of the company
        const employer = await User.findOne({ _id: user_id , company_id: company_id });
        if (!employer) {
            return res.status(403).json({ message: "You are not authorized to post jobs for this company" });
        }

        const newJobPost = new JobPost({
            company_id,
            user_id,
            title,
            description,
            location,
            salary,
            job_type
        });
        
        const savedJobPost = await newJobPost.save();

        //Update job_posts array in Employer and Company
        await Employer.updateOne(
            {user_id: user_id},
            { $push: { job_posts: savedJobPost._id } }
        );

        await Company.updateOne(
            { _id: company_id },
            { $push: { job_posts: savedJobPost._id } }
        );

        res.status(201).json(savedJobPost);
    } catch (error) {
        console.error("Error creating job post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllJobPostsByEmployerId = async (req, res) => {
    try {
        const { employer_id } = req.params;

        const employer = await Employer.findOne({ _id: employer_id });
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

        const jobPosts = await JobPost.find({ user_id: employer.user_id });
        res.status(200).json(jobPosts);
    } catch (error) {
        console.error("Error fetching job posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createJobPost, getAllJobPostsByEmployerId
  };