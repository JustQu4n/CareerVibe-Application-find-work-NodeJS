const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");
const JobSeeker = require("../database/models/JobSeeker");
const Employer = require("../database/models/Employer");
const Company = require("../database/models/Companies");

// Đăng ký JobSeeker
const registerJobSeeker = async (req, res) => {
  const { email, password, full_name, phone, address, skills } = req.body;

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
    });
    await jobSeeker.save();

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
        },
        token,
      },
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
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng ký Employer
const registerEmployer = async (req, res) => {
  const { email, password, company_name, company_address, company_logo_url, company_description } = req.body;

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

    // Tạo công ty mới
    const company = new Company({
      name: company_name,
      address: company_address,
      logo_url: company_logo_url,
      description: company_description,
    });
    await company.save();

    // Tạo hồ sơ Employer
    const employer = new Employer({
      user_id: user._id,
      company_id: company._id,
    });
    await employer.save();

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Trả về kết quả
    res.status(201).json({
      message: "Employer registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        company: {
          id: company._id,
          name: company.name,
          address: company.address,
          logo_url: company.logo_url,
          description: company.description,
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
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lấy thông tin Employer và Company
    const employer = await Employer.findOne({ user_id: user._id }).populate("company_id");

    // Trả về kết quả
    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        company: {
          id: employer.company_id._id,
          name: employer.company_id.name,
          address: employer.company_id.address,
          logo_url: employer.company_id.logo_url,
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

module.exports = { registerJobSeeker, loginJobSeeker, registerEmployer, loginEmployer };