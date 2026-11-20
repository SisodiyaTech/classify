import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 100,
    },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        studentName: String,
        fileName: String,
        fileUrl: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['Submitted', 'Graded'],
          default: 'Submitted',
        },
        grade: String,
        feedback: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
