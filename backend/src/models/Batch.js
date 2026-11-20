import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide batch name'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseTitle: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: String,
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      required: true,
      default: ['Saturday', 'Sunday'],
    },
    daysDisplay: {
      type: String,
      default: 'Sat & Sun',
    },
    timing: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 90,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    maxCapacity: {
      type: Number,
      required: true,
      default: 12, // recommended 10-15
      max: [50, 'Batch capacity cannot exceed 50 students as per platform rules'],
      min: [1, 'Batch capacity must be at least 1'],
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for available seats
batchSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.maxCapacity - this.enrolledCount);
});

batchSchema.set('toJSON', { virtuals: true });
batchSchema.set('toObject', { virtuals: true });

export const Batch = mongoose.model('Batch', batchSchema);
export default Batch;
