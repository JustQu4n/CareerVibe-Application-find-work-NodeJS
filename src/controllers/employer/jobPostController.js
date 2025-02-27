const JobPost = require('../../database/models/JobPost');
const User = require('../../database/models/User');
const Employer = require('../../database/models/Employer');
const Company = require('../../database/models/Companies');

const createJobPost = async (req, res) => {
    try {
        const { user_id, company_id, title, description, location, address, experience, level, salary, gender, job_type, expires_at } = req.body;
        
        //Check if the user is the owner of the company
        const employer = await User.find({ _id: user_id , company_id: company_id });
        console.log("aaaaa",employer);
        if (!employer) {
            return res.status(403).json({ message: "You are not authorized to post jobs for this company" });
        }

        const newJobPost = new JobPost({
            company_id,
            user_id,
            title,
            description,
            location,
            address,
            experience,
            level,
            salary,
            gender,
            job_type,
            expires_at
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

const updateJobPost = async (req, res) => {
    try {
        const jobPostId = req.params.id;
        const { user_id, company_id, title, description, location, salary, job_type, status } = req.body;
        
      // Kiểm tra xem user_id và company_id có khớp với employer không
        const employer = await Employer.find({  _id: user_id , company_id: company_id });
        if (!employer) {
        return res.status(403).json({ message: "You are not authorized to update this job post" });
        }

        // Update job post
        const updatedJobPost = await JobPost.findByIdAndUpdate(
        jobPostId,
        { title, description, location, salary, job_type, status, updated_at: Date.now() },
        { new: true } 
        );

        if (!updatedJobPost) {
        return res.status(404).json({ message: "Job post not found" });
        }

        res.status(200).json(updatedJobPost);
    } catch (error) {
        console.error("Error updating job post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteJobPost = async (req, res) => {
    try {
    const jobPostId = req.params.id;
    const { user_id, company_id } = req.query;

    // Kiểm tra xem user_id và company_id có khớp với employer không
    const employer = await Employer.find({  _id: user_id , company_id: company_id });
    if (!employer) {
        return res
        .status(403)
        .json({ message: "You are not authorized to delete this job post" });
    }

    // Xóa bài tuyển dụng
    const deletedJobPost = await JobPost.findByIdAndDelete(jobPostId);
    if (!deletedJobPost) {
        return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchJobs = async (req, res) => {
    try {
        
        const { title, location } = req.query;
        let query = {};
        if (title) {
            query.title = { $regex: title, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
          }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        const jobs = await JobPost.find(query).sort({ created_at: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error searching job posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const filterJobs = async (req, res) => {
    try {
        console.log(req.query);
        const { title, location, job_type, experience, level, min_salary, max_salary } = req.query; //add more if needed
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }

        if (location) {
            query.location = { $regex: location.replace(/\s+/g, "\\s*"), $options: "i" };
        }

        if (experience) {
            query.experience = { $regex: experience.replace(/\s+/g, "\\s*"), $options: "i" };
        }

        if (level) {
            query.level = { $regex: level.replace(/\s+/g, "\\s*"), $options: "i" };
        }

        if (job_type) {
            query.job_type = job_type;
        }

        if (min_salary || max_salary) {
            query.salary = {};
            if (min_salary) query.salary.$gte = parseInt(min_salary); 
            if (max_salary) query.salary.$lte = parseInt(max_salary); 
        }

        const jobs = await JobPost.find(query).sort({ created_at: -1 });
        res.status(200).json({ success: true, data: jobs });

    } catch (error) {
        console.error("Error filtering job posts:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

module.exports = {
    createJobPost, getAllJobPostsByEmployerId, updateJobPost, deleteJobPost, searchJobs, filterJobs
  };