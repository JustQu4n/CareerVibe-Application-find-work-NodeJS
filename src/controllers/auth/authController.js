const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const JobSeeker = require("../../database/models/JobSeeker");
const Employer = require("../../database/models/Employer");
const Company = require("../../database/models/Companies");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.API_SECRET,
});

// Helper function for Cloudinary upload using memory storage
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "careerVibe",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Đăng ký JobSeeker
const registerJobSeeker = async (req, res) => {
  const { email, password, full_name, phone, address, skills } = req.body;
  console.log("Request body:", {
    email,
    password_exists: !!password,
    password_type: typeof password,
    full_name,
    phone,
    skills,
    profile_image: req.file ? req.file.originalname : "No file",
  });

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    const cloudResponse = await uploadToCloudinary(req.file.buffer);

    // Tạo người dùng mới
    const user = new User({
      email,
      password_hash: hashedPassword,
      role: "job_seeker",
    });
    await user.save();

    // Tạo hồ sơ JobSeeker
    const jobSeeker = new JobSeeker({
      user_id: user._id,
      full_name,
      phone,
      address,
      skills,
      avatar: cloudResponse.secure_url,
    });
    await jobSeeker.save();

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Trả về kết quả
    res.status(201).json({
      message: "JobSeeker registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        jobSeeker: {
          id: jobSeeker._id,
          full_name: jobSeeker.full_name,
          phone: jobSeeker.phone,
          address: jobSeeker.address,
          skills: jobSeeker.skills,
          avatar: jobSeeker.avatar,
        },
        token,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng nhập JobSeeker
const loginJobSeeker = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra người dùng tồn tại
    const user = await User.findOne({ email, role: "job_seeker" });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Lấy thông tin JobSeeker
    const jobSeeker = await JobSeeker.findOne({ user_id: user._id });

    // Trả về kết quả
    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        jobSeeker: {
          id: jobSeeker._id,
          full_name: jobSeeker.full_name,
          phone: jobSeeker.phone,
          address: jobSeeker.address,
          skills: jobSeeker.skills,
          avatar: jobSeeker.avatar,
          bio: jobSeeker.bio,
        },
        token,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng ký Employer
const registerEmployer = async (req, res) => {
  const {
    email,
    password,
    full_name,
    company_id,
    is_existing_company,
    company_name,
    company_address,
    company_domain,
  } = req.body;
  console.log("Request body:", {
    email,
    password_exists: !!password,
    password_type: typeof password,
    full_name,
    company_id,
    is_existing_company,
    company_name,
    company_address,
    company_domain,
    logo: req.file ? req.file.originalname : "No file",
  });
  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const user = new User({
      email,
      password_hash: hashedPassword,
      role: "employer",
    });
    await user.save();
    let company;

    // Kiểm tra xem người dùng đã chọn công ty có sẵn chưa
    if (is_existing_company === "true" && company_id) {
      // Sử dụng công ty đã tồn tại
      company = await Company.findById(company_id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
    } else {
      // Yêu cầu logo khi tạo công ty mới
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          message: "Logo image is required",
          success: false,
        });
      }

      const cloudResponse = await uploadToCloudinary(req.file.buffer);
      // Tạo công ty mới
      company = new Company({
        name: company_name,
        address: company_address,
        logo: cloudResponse.secure_url,
        email_domain: company_domain,
      });
      await company.save();
    }
    // Tạo hồ sơ Employer
    const employer = new Employer({
      user_id: user._id,
      full_name,
      company_id: company._id,
    });
    await employer.save();

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Trả về kết quả
    res.status(201).json({
      message: "Employer registered successfully",
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        employer: {
          id: employer._id,
          full_name: employer.full_name,
          phone: employer.phone,
          address: employer.address,
          avatar_url: employer.avatar_url,
        },
        company: {
          id: company._id,
          name: company.name,
          address: company.address,
          logo: company.logo,
          domain: company.domain,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng nhập Employer
const loginEmployer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra người dùng tồn tại
    const user = await User.findOne({ email, role: "employer" });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Lấy thông tin Employer và Company
    const employer = await Employer.findOne({ user_id: user._id }).populate(
      "company_id"
    );

    // Trả về kết quả
    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        employer: {
          id: employer._id,
          full_name: employer.full_name,
          phone: employer.phone,
          address: employer.address,
          avatar_url: employer.avatar_url,
        },
        company: {
          id: employer.company_id._id,
          name: employer.company_id.name,
          address: employer.company_id.address,
          logo: employer.company_id.logo,
          domain: employer.company_id.email_domain,
          website: employer.company_id.website,
          description: employer.company_id.description,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // In a real production app, you would add this token to a blacklist
    // (e.g., in Redis or a database table) until it expires
    // For example: await addToBlacklist(token, jwt.decode(token).exp);

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerJobSeeker,
  loginJobSeeker,
  registerEmployer,
  loginEmployer,
  logout,
};
