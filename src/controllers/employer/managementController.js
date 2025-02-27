const Application = require('../../database/models/Application');
const JobPost = require('../../database/models/JobPost');
const JobSeeker = require('../../database/models/JobSeeker');
const User = require('../../database/models/User');
const { sendMail } = require('../../utils/mailer');
const { applicationStatusTemplate, congratulatoryEmailTemplate } = require('../../utils/emailTemplates');

const getAllApplicationsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Find all job posts by the company
        const jobPosts = await JobPost.find({ company_id: companyId });
        const jobPostIds = jobPosts.map(jobPost => jobPost._id);

        // Find all applications for the job posts
        const applications = await Application.find({ job_post_id: { $in: jobPostIds } }).populate('job_post_id').populate({
            path: 'job_seeker_id',
            populate: {
                path: 'user_id',
                model: 'User'
            }
        });

        if (!applications.length) {
            return res.status(404).json({ message: "No applications found for this company" });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        const updatedApplication = await Application.findByIdAndUpdate(applicationId, { status }, { new: true }).populate({
            path: 'job_seeker_id',
            populate: {
                path: 'user_id',
                model: 'User'
            }
        }).populate('job_post_id');

        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Send mail to job seeker
        const jobSeekerEmail = updatedApplication.job_seeker_id.user_id.email;
        const jobSeekerName = updatedApplication.job_seeker_id.full_name;
        console.log(jobSeekerName);
        const jobTitle = updatedApplication.job_post_id.title;
        const emailContent = applicationStatusTemplate(jobSeekerName, jobTitle, status);

        if(status !== 'pass') {
        await sendMail(jobSeekerEmail, 'Application Status Update', emailContent);
        }
        // Send congratulatory email if status is "completed"
        if (status === 'pass') {
            await sendCongratulatoryEmail(jobSeekerEmail, jobSeekerName, jobTitle);
        }

        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendCongratulatoryEmail = async (jobSeekerEmail, jobSeekerName, jobTitle) => {
    try {
        const emailContent = congratulatoryEmailTemplate(jobSeekerName, jobTitle);
        await sendMail(jobSeekerEmail, 'Congratulations! You Passed the CV Screening', emailContent);
    } catch (error) {
        console.error("Error sending congratulatory email:", error);
        throw new Error('Error sending congratulatory email');
    }
};

module.exports = { getAllApplicationsByCompany, updateApplicationStatus };