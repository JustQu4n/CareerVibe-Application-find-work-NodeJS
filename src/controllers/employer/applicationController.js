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
         .populate({ 
            path: "job_seeker_id", 
            select: "full_name avatar skills experience phone",
            populate: {
              path: "user_id",
              model: "User",
              select: "email" // Lấy email và các thông tin cần thiết khác từ model User
            }
          })
          .populate("job_post_id", "title description location skills experience level salary status created_at"); // populate tiêu đề bài viết
    
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
      .populate({ 
            path: "job_seeker_id", 
            select: "full_name avatar skills experience address phone",
            populate: {
              path: "user_id",
              model: "User",
              select: "email" // Lấy email và các thông tin cần thiết khác từ model User
            }
          })
      .populate("job_post_id", "title description location skills experience level salary status created_at");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ application, success: true });
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
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Giá trị trạng thái không hợp lệ. Phải là một trong: pending, reviewed, accepted, rejected"
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
    }).populate("employer_id", "company_name");
    
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
    ).populate({
      path: 'job_seeker_id',
      populate: {
        path: 'user_id',
        model: 'User'
      }
    }).populate('job_post_id');
    
    // Gửi email thông báo dựa trên trạng thái mới
    const jobSeekerEmail = updatedApplication.job_seeker_id.user_id.email;
    const jobSeekerName = updatedApplication.job_seeker_id.full_name;
    const jobTitle = updatedApplication.job_post_id.title;
    const companyName = jobPost.employer_id.company_name || "Công ty";
    
    // Sử dụng utility gửi mail đã có
    const { sendMail } = require('../../utils/mailer');
    const { applicationStatusTemplate, congratulatoryEmailTemplate } = require('../../utils/emailTemplates');
    
    // Xử lý gửi email theo từng loại trạng thái
    if (status === 'accepted') {
      // Email chúc mừng cho trạng thái accepted
      const emailContent = applicationStatusTemplate(
        jobSeekerName,
        jobTitle, 
        status,
        `Chúng tôi vui mừng thông báo rằng đơn ứng tuyển của bạn đã được chấp nhận! Chúng tôi rất ấn tượng với hồ sơ và kinh nghiệm của bạn, và tin rằng bạn sẽ là một thành viên tuyệt vời trong đội ngũ của chúng tôi. Trong vài ngày tới, đội ngũ nhân sự của chúng tôi sẽ liên hệ với bạn để thảo luận về các bước tiếp theo.`
      );
      await sendMail(jobSeekerEmail, `Chúc mừng! Đơn ứng tuyển của bạn đã được chấp nhận - ${jobTitle}`, emailContent);
    } 
    else if (status === 'rejected') {
      // Email từ chối nhẹ nhàng
      const emailContent = applicationStatusTemplate(
        jobSeekerName,
        jobTitle, 
        status,
        `Cảm ơn bạn đã quan tâm đến vị trí này và đã dành thời gian để ứng tuyển. Sau khi xem xét cẩn thận hồ sơ của bạn, chúng tôi rất tiếc phải thông báo rằng chúng tôi đã quyết định tiếp tục với các ứng viên khác có kinh nghiệm và kỹ năng phù hợp hơn với vị trí hiện tại.`
      );
      await sendMail(jobSeekerEmail, `Thông báo về đơn ứng tuyển của bạn - ${jobTitle}`, emailContent);
    }
    else if (status === 'reviewed') {
      // Email đã xem xét
      const emailContent = applicationStatusTemplate(
        jobSeekerName,
        jobTitle, 
        status,
        `Chúng tôi đã xem xét đơn ứng tuyển của bạn. Hồ sơ của bạn đang được đánh giá chi tiết và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất để thông báo về các bước tiếp theo.`
      );
      await sendMail(jobSeekerEmail, `Đơn ứng tuyển của bạn đã được xem xét - ${jobTitle}`, emailContent);
    }
    else if (status === 'pending') {
      // Email đang xem xét
      const emailContent = applicationStatusTemplate(
        jobSeekerName,
        jobTitle, 
        status,
        `Đơn ứng tuyển của bạn đang được xem xét. Chúng tôi sẽ thông báo cho bạn khi có bất kỳ cập nhật nào.`
      );
      await sendMail(jobSeekerEmail, `Đơn ứng tuyển của bạn đang được xem xét - ${jobTitle}`, emailContent);
    }
    else if (status === 'pass') {
      // Sử dụng email chúc mừng đặc biệt nếu trạng thái là pass
      await sendCongratulatoryEmail(jobSeekerEmail, jobSeekerName, jobTitle);
    }
    else {
      // Email mặc định cho các trạng thái khác
      const emailContent = applicationStatusTemplate(jobSeekerName, jobTitle, status);
      await sendMail(jobSeekerEmail, `Cập nhật trạng thái đơn ứng tuyển - ${jobTitle}`, emailContent);
    }
    
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

// Kế thừa function sendCongratulatoryEmail từ code hiện tại
const sendCongratulatoryEmail = async (jobSeekerEmail, jobSeekerName, jobTitle) => {
  try {
    const { sendMail } = require('../../utils/mailer');
    const { congratulatoryEmailTemplate } = require('../../utils/emailTemplates');
    
    const emailContent = congratulatoryEmailTemplate(jobSeekerName, jobTitle);
    await sendMail(jobSeekerEmail, 'Congratulations! You Passed the CV Screening', emailContent);
  } catch (error) {
    console.error("Error sending congratulatory email:", error);
    throw new Error('Error sending congratulatory email');
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