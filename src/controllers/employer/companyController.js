const Company = require('../../database/models/Companies');
const JobPost = require('../../database/models/JobPost');


const listAllJobPostsOfCompany = async (req, res) => {
    try {
        const { company_id } = req.params;

        const company = await Company.findById(company_id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const jobPosts = await JobPost.find({ company_id: company_id });
        res.status(200).json(jobPosts);
    } catch (error) {
        console.error("Error fetching job posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateCompany = async (req, res) => {
    try {
        const { company_id } = req.params;
        const { name, address, logo_url, description } = req.body;

        const company = await Company.findById(company_id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            company_id,
            { name, address, logo_url, description },
            { new: true }
        );

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    listAllJobPostsOfCompany, updateCompany
};