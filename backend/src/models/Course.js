import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: String,
    instructorAvatar: String,
    instructorHeadline: String,
    category: {
      type: String,
      required: [true, 'Please provide course category'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    language: {
      type: String,
      default: 'English & Hindi',
    },
    price: {
      type: Number,
      required: [true, 'Please specify price'],
      min: 0,
    },
    originalPrice: {
      type: Number,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide full description'],
    },
    learningOutcomes: [String],
    prerequisites: [String],
    curriculum: [
      {
        week: Number,
        title: String,
        sessions: Number,
        duration: String,
        topics: [String],
      },
    ],
    status: {
      type: String,
      enum: ['Pending Review', 'Approved', 'Draft', 'Archived', 'Rejected'],
      default: 'Pending Review',
    },
    totalEnrolledStudents: {
      type: Number,
      default: 0,
    },
    activeBatchesCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate slug
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

export const Course = mongoose.model('Course', courseSchema);
export default Course;
