const Application = require("../../database/models/Application");
const JobPost = require("../../database/models/JobPost");
const mongoose = require("mongoose");
const Employer = require("../../database/models/Employer");

/**
 * Lấy tất cả applications cho một job post cụ thể của employer
 */
const getApplicationsByJobPost = async (req, res) => {
    try {
        const employerId = req.user.id; // lấy user id từ token
        const employer = await Employer.findOne({ user_id: employerId });
    
        if (!employer) {
          return res.status(404).json({ message: "Employer not found" });
        }
    
        // Tìm tất cả job_post của employer
        const jobPosts = await JobPost.find({ user_id: employer.user_id }).select("_id");
    
        const jobPostIds = jobPosts.map(post => post._id);
    
        // Tìm tất cả application cho các job_post đó
        const applications = await Application.find({ job_post_id: { $in: jobPostIds } })
          .populate("job_seeker_id", "full_name avatar skills experience") // populate thông tin ứng viên
          .populate("job_post_id", "title location"); // populate tiêu đề bài viết
    
        res.json({ applications });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
};

/**
 * Lấy chi tiết một application cụ thể
 */
const getApplicationDetail = async (req, res) => {
  try {
    const { applicationId } = req.params; // id của application
    console.log("Application ID:", applicationId); // Log ID để kiểm tra
    const application = await Application.findById(applicationId)
      .populate("job_seeker_id", "full_name avatar skills experience address phone")
      .populate("job_post_id", "title description location skills experience level salary");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ application, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Cập nhật trạng thái của đơn ứng tuyển
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.employer.id;
    
    // Kiểm tra giá trị status
    const validStatuses = ["pending", "reviewed", "accepted", "rejected", "pass"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Giá trị trạng thái không hợp lệ. Phải là một trong: pending, reviewed, accepted, rejected, pass"
      });
    }
    
    // Tìm application
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển"
      });
    }
    
    // Kiểm tra xem job post có thuộc về employer này không
    const jobPost = await JobPost.findOne({ 
      _id: application.job_post_id, 
      employer_id: employerId 
    });
    
    if (!jobPost) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa đơn ứng tuyển này"
      });
    }
    
    // Cập nhật trạng thái application
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate("job_seeker_id", "first_name last_name email");
    
    return res.status(200).json({
      success: true,
      message: `Trạng thái đơn ứng tuyển đã được cập nhật thành ${status}`,
      data: updatedApplication
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái đơn ứng tuyển"
    });
  }
};

/**
 * Cập nhật hàng loạt trạng thái của nhiều đơn ứng tuyển
 */
const batchUpdateApplications = async (req, res) => {
  try {
    const { applicationIds, status } = req.body;
    const employerId = req.employer.id;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách ID đơn ứng tuyển không hợp lệ"
      });
    }
    
    // Kiểm tra giá trị status
    const validStatuses = ["pending", "reviewed", "accepted", "rejected", "pass"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Giá trị trạng thái không hợp lệ. Phải là một trong: pending, reviewed, accepted, rejected, pass"
      });
    }
    
    // Tìm tất cả applications để kiểm tra quyền
    const applications = await Application.find({
      _id: { $in: applicationIds }
    });
    
    // Lấy danh sách job post ids từ các applications
    const jobPostIds = [...new Set(applications.map(app => app.job_post_id.toString()))];
    
    // Kiểm tra xem tất cả job posts có thuộc về employer này không
    const authorizedJobPosts = await JobPost.find({
      _id: { $in: jobPostIds },
      employer_id: employerId
    });
    
    if (authorizedJobPosts.length !== jobPostIds.length) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật một số đơn ứng tuyển đã chọn"
      });
    }
    
    // Cập nhật hàng loạt các applications
    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { status }
    );
    
    return res.status(200).json({
      success: true,
      message: `Đã cập nhật ${result.modifiedCount} đơn ứng tuyển thành trạng thái ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error batch updating applications:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật hàng loạt đơn ứng tuyển"
    });
  }
};

/**
 * Lấy thống kê đơn ứng tuyển cho một job post
 */
const getApplicationStatistics = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const employerId = req.employer.id;
    
    // Kiểm tra xem job post có thuộc về employer này không
    const jobPost = await JobPost.findOne({ 
      _id: jobPostId, 
      employer_id: employerId 
    });
    
    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài đăng tuyển dụng hoặc bạn không có quyền xem"
      });
    }
    
    // Đếm applications theo trạng thái
    const stats = await Application.aggregate([
      { $match: { job_post_id: mongoose.Types.ObjectId(jobPostId) } },
      { $group: { 
          _id: "$status", 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Chuyển đổi kết quả thành định dạng dễ sử dụng hơn
    const statsByStatus = {
      total: 0,
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
      pass: 0
    };
    
    stats.forEach(stat => {
      statsByStatus[stat._id] = stat.count;
      statsByStatus.total += stat.count;
    });
    
    return res.status(200).json({
      success: true,
      data: statsByStatus
    });
  } catch (error) {
    console.error("Error getting application statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê đơn ứng tuyển"
    });
  }
};

module.exports = {
  getApplicationsByJobPost,
  getApplicationDetail,
  updateApplicationStatus,
  batchUpdateApplications,
  getApplicationStatistics
};