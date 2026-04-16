import mongoose from 'mongoose';

export const APP_STATUSES = ['applied', 'shortlisted', 'rejected', 'hired'];

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: APP_STATUSES,
      default: 'applied',
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
