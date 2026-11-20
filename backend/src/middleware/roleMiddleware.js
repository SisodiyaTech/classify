// Restrict route access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// Check if an instructor is approved before allowing course/batch creation
export const checkInstructorVerified = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next(); // Admins bypass
  }

  if (req.user.role !== 'instructor') {
    return res.status(403).json({
      success: false,
      message: 'Only instructors can perform this action.',
    });
  }

  if (req.user.verificationStatus !== 'Approved') {
    return res.status(403).json({
      success: false,
      message: 'Only verified and approved instructors can publish courses and schedule batches.',
      verificationStatus: req.user.verificationStatus,
    });
  }

  next();
};

export default { authorize, checkInstructorVerified };
