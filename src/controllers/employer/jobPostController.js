const JobPost = require("../../database/models/JobPost");
const User = require("../../database/models/User");
const Employer = require("../../database/models/Employer");
const Company = require("../../database/models/Companies");

const createJobPost = async (req, res) => {
  try {
    const {
      user_id,
      company_id,
      title,
      description,
      location,
      address,
      experience,
      level,
      salary,
      gender,
      job_type,
      expires_at,
    } = req.body;

    //Check if the user is the owner of the company
    const employer = await User.find({ _id: user_id, company_id: company_id });
    console.log("aaaaa", employer);
    if (!employer) {
      return res.status(403).json({
        message: "You are not authorized to post jobs for this company",
      });
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
      expires_at,
    });

    const savedJobPost = await newJobPost.save();

    //Update job_posts array in Employer and Company
    await Employer.updateOne(
      { user_id: user_id },
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
};

const getAllJobPostsByEmployerId = async (req, res) => {
  try {
    const { employer_id } = req.params;
    const employer = await Employer.findOne({ _id: employer_id });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const jobs = await JobPost.find({ user_id: employer.user_id });
    res.status(200).json({jobs, status: true});
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateJobPost = async (req, res) => {
  try {
    const jobPostId = req.params.id;
    const {
      user_id,
      company_id,
      title,
      description,
      location,
      address,
      experience,
      skills,
      level,
      salary,
      gender,
      job_type,
      expires_at,
      status
    } = req.body;

    // First check if the job post exists
    const jobPost = await JobPost.findById(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ 
        success: false,
        message: "Job post not found" 
      });
    }

    // Check if the user is authorized to update this job post
    const employer = await Employer.findOne({ user_id: user_id });
    if (!employer) {
      return res.status(403).json({ 
        success: false,
        message: "You are not authorized to update this job post" 
      });
    }

    // Update job post with all model fields
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      jobPostId,
      {
        company_id,
        title,
        description,
        location,
        address,
        experience,
        skills,
        level,
        salary,
        gender,
        job_type,
        expires_at,
        status,
        updated_at: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job post updated successfully",
      data: updatedJobPost
    });
  } catch (error) {
    console.error("Error updating job post:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const deleteJobPost = async (req, res) => {
  try {
    const jobPostId = req.params.id;
    const { user_id, company_id } = req.query;

    // Kiểm tra xem user_id và company_id có khớp với employer không
    const employer = await Employer.find({
      _id: user_id,
      company_id: company_id,
    });
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
};
const filterJobs = async (req, res) => {
  try {
    console.log(req.query);
    const {
      title,
      location,
      job_type,
      experience,
      level,
      min_salary,
      max_salary,
    } = req.query; //add more if needed
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (location) {
      query.location = {
        $regex: location.replace(/\s+/g, "\\s*"),
        $options: "i",
      };
    }

    if (experience) {
      query.experience = {
        $regex: experience.replace(/\s+/g, "\\s*"),
        $options: "i",
      };
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
};

const getAllJobs = async (req, res) => {
  try {
    // Lấy page và limit từ query params, mặc định là page 1, limit 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Đếm tổng số job posts
    const totalJobPosts = await JobPost.countDocuments();

    // Lấy danh sách job posts với phân trang
    const jobPosts = await JobPost.find()
      .populate("company_id") // nếu muốn lấy thông tin công ty
      .populate("user_id") // nếu muốn lấy thông tin người tạo bài
      .sort({ created_at: -1 }) // sắp xếp mới nhất trước
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      jobs: jobPosts,
      pagination: {
        total: totalJobPosts,
        page,
        limit,
        totalPages: Math.ceil(totalJobPosts / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching job posts:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/job-posts/:id
const getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm job post theo ID và populate thông tin liên quan
    const jobPost = await JobPost.findById(id)
      .populate("company_id")
      .populate("user_id");

    if (!jobPost) {
      return res
        .status(404)
        .json({ success: false, message: "Job post not found" });
    }

    return res.status(200).json({ success: true, job: jobPost });
  } catch (err) {
    console.error("Error fetching job post by ID:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPostRelated = async (req, res) => {
  const { jobId } = req.params;

  try {
    const currentJob = await JobPost.findById(jobId);
    if (!currentJob) return res.status(404).json({ message: 'Job not found' });

    const allJobs = await JobPost.find({ _id: { $ne: jobId } });

    const computeSimilarity = (jobA, jobB) => {
      let score = 0;

      // So khớp vị trí (location)
      if (jobA.location === jobB.location) score += 2;

      // So khớp cấp bậc (level)
      if (jobA.level && jobB.level && jobA.level === jobB.level) score += 2;

      // So khớp kỹ năng
      const skillsA = jobA.skills || [];
      const skillsB = jobB.skills || [];
      const matchedSkills = skillsA.filter(skill => skillsB.includes(skill));
      score += matchedSkills.length; // mỗi kỹ năng trùng = +1

      // So khớp tiêu đề gần đúng
      const titleWordsA = jobA.title.toLowerCase().split(' ');
      const titleWordsB = jobB.title.toLowerCase().split(' ');
      const commonWords = titleWordsA.filter(word => titleWordsB.includes(word));
      score += commonWords.length * 0.5;

      return score;
    };

    const scoredJobs = allJobs.map(job => ({
      ...job.toObject(),
      similarityScore: computeSimilarity(currentJob, job),
    }));

    // Sắp xếp theo similarity score giảm dần và lấy top 5
    const relatedJobs = scoredJobs
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);

    return res.status(200).json({ success: true, relatedJobs: relatedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  createJobPost,
  getAllJobPostsByEmployerId,
  updateJobPost,
  deleteJobPost,
  searchJobs,
  filterJobs,
  getAllJobs,
  getJobPostById,
  getPostRelated,
};
