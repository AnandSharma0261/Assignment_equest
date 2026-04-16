import mongoose from 'mongoose';

export const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, index: true },
    jobType: { type: String, enum: JOB_TYPES, required: true, index: true },
    description: { type: String, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    requirements: { type: [String], default: [] },
    aboutTeam: { type: String, trim: true },
    industry: { type: String, trim: true },
    companyTagline: { type: String, trim: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
