import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseTitle: String,
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    batchName: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: String,
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true, // 15% platform commission
    },
    instructorPayout: {
      type: Number,
      required: true, // 85% instructor payout
    },
    method: {
      type: String,
      default: 'UPI / Card',
    },
    status: {
      type: String,
      enum: ['Completed', 'Refunded', 'Pending'],
      default: 'Completed',
    },
    payoutStatus: {
      type: String,
      enum: ['Unsettled', 'Requested', 'Settled'],
      default: 'Unsettled',
    },
    receiptUrl: {
      type: String,
      default: '#',
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
