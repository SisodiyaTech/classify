import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Register a new user (Student or Instructor)
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, skills, headline, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const assignedRole = role === 'instructor' ? 'instructor' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      headline: headline || (assignedRole === 'instructor' ? 'Aspiring Instructor' : 'Enthusiastic Learner'),
      bio: bio || '',
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      avatar: assignedRole === 'instructor'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      verificationStatus: assignedRole === 'instructor' ? 'Not Submitted' : undefined,
    });

    const token = generateToken(user._id, user.role);

    // Send welcome email
    sendEmail({
      to: user.email,
      subject: `Welcome to Classify, ${user.name}!`,
      html: `
        <h2>Welcome to Classify!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining Classify, the small-batch live coaching marketplace.</p>
        ${assignedRole === 'instructor'
          ? '<p>Please complete your instructor profile verification to start scheduling live cohorts.</p>'
          : '<p>Explore our small cohorts and learn hands-on with live personal attention!</p>'}
      `,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        skills: user.skills,
        verificationStatus: user.verificationStatus,
        rating: user.rating,
        totalEarnings: user.totalEarnings,
        availableBalance: user.availableBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      headline: req.body.headline,
      bio: req.body.bio,
      location: req.body.location,
      phone: req.body.phone,
      avatar: req.body.avatar,
    };

    if (req.body.skills) {
      fieldsToUpdate.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim());
    }

    if (req.body.languages) {
      fieldsToUpdate.languages = Array.isArray(req.body.languages)
        ? req.body.languages
        : req.body.languages.split(',').map((l) => l.trim());
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit instructor verification application
// @route   POST /api/v1/auth/instructor-verification
// @access  Private (Instructor only)
export const submitInstructorVerification = async (req, res, next) => {
  try {
    const {
      fullName,
      headline,
      bio,
      skills,
      experienceYears,
      languages,
      videoIntroUrl,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: fullName || req.user.name,
        headline,
        bio,
        experienceYears: Number(experienceYears) || 1,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((s) => s.trim()),
        languages: Array.isArray(languages)
          ? languages
          : languages.split(',').map((l) => l.trim()),
        videoIntroUrl: videoIntroUrl || '',
        verificationStatus: 'Pending Review',
        verificationDocuments: [
          {
            name: 'Government_ID_Proof.pdf',
            type: 'Identity Proof',
            url: '#',
            status: 'Pending Review',
          },
          {
            name: 'Skill_Mastery_Certificate.pdf',
            type: 'Skill Certificate',
            url: '#',
            status: 'Pending Review',
          },
        ],
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Instructor verification application submitted for admin review.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user registered with this email address.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Classify - Password Reset Instructions',
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested a password reset for your Classify account.</p>
        <p>Please click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
      token,
    });
  } catch (error) {
    next(error);
  }
};
