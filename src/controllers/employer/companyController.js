const Company = require('../../database/models/Companies');
const JobPost = require('../../database/models/JobPost');


const listAllJobPostsOfCompany = async (req, res) => {
    try {
        const { company_id } = req.params;

        const company = await Company.findById(company_id);
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: "Company not found" 
            });
        }

        const jobPosts = await JobPost.find({ company_id: company_id });
        
        res.status(200).json({
            success: true,
            data: {
                company:{
                    id: company._id,
                    name: company.name,
                    address: company.address,
                    logo_url: company.logo_url,
                    description: company.description
                },
                jobPosts: {
                    count: jobPosts.length,
                    posts: jobPosts.map(post => ({
                        id: post._id,
                        title: post.title,
                        description: post.description,
                        location: post.location,
                        salary: post.salary
                    }))
                }
            }
        });
    } catch (error) {
        console.error("Error fetching job posts:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
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

const getNameCompany = async (req, res) => {
    try {
        // Lấy tất cả công ty, chỉ bao gồm trường name và _id
        const companies = await Company.find({}, 'name _id logo email_domain address');
        
        // Trả về danh sách tên công ty
        return res.status(200).json({
            success: true,
            count: companies.length,
            data: companies.map(company => ({
                id: company._id,
                name: company.name,
                logo: company.logo,
                email_domain: company.email_domain,
                address: company.address
            }))
        });
    } catch (error) {
        console.error("Error fetching company names:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error when fetching company names"
        });
    }
}

module.exports = {
    listAllJobPostsOfCompany, updateCompany, getNameCompany
};