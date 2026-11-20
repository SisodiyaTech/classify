import Course from '../models/Course.js';
import Batch from '../models/Batch.js';

// @desc    Get all published/approved courses with filtering & pagination
// @route   GET /api/v1/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      language,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'Approved' };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { instructorName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }

    // Level filter
    if (level && level !== 'all') {
      query.level = level;
    }

    // Language filter
    if (language && language !== 'all') {
      query.language = { $regex: language, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating
    if (rating && rating !== 'all') {
      query.rating = { $gte: Number(rating) };
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'price-low') sortOptions.price = 1;
    else if (sort === 'price-high') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1; // Default newest

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with its batches
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name avatar headline bio rating totalReviews verificationStatus experienceYears languages'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Fetch active batches for this course
    const batches = await Batch.find({ course: course._id });

    res.status(200).json({
      success: true,
      course,
      batches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course (Instructor only)
// @route   POST /api/v1/courses
// @access  Private (Approved Instructor)
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      category,
      level,
      language,
      price,
      originalPrice,
      thumbnail,
      shortDescription,
      fullDescription,
      learningOutcomes,
      prerequisites,
      curriculum,
    } = req.body;

    const course = await Course.create({
      title,
      category,
      level: level || 'Beginner',
      language: language || 'English & Hindi',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      thumbnail:
        thumbnail ||
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      shortDescription,
      fullDescription,
      learningOutcomes: learningOutcomes || [],
      prerequisites: prerequisites || [],
      curriculum: curriculum || [],
      instructor: req.user._id,
      instructorName: req.user.name,
      instructorAvatar: req.user.avatar,
      instructorHeadline: req.user.headline,
      status: 'Pending Review', // Requires admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Course submitted successfully and is pending admin approval.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Course Owner / Admin)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this course.',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Archive course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Course Owner / Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course.',
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
