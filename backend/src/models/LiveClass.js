import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    batchName: String,
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
    title: {
      type: String,
      required: [true, 'Class title is required'],
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 90,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Live Now', 'Completed'],
      default: 'Scheduled',
    },
    agenda: {
      type: String,
      default: '',
    },
    materialsNeeded: [String],
    recordingUrl: {
      type: String,
      default: '',
    },
    attendees: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: Date,
        leftAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const LiveClass = mongoose.model('LiveClass', liveClassSchema);
export default LiveClass;
