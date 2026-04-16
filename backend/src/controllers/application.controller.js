import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Application, { APP_STATUSES } from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { sendMail } from '../utils/email.js';
import { cacheDel, keys } from '../utils/cache.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeUrl } = req.body;
  if (!jobId || !mongoose.isValidObjectId(jobId)) {
    res.status(400);
    throw new Error('Valid jobId is required');
  }

  const job = await Job.findById(jobId).populate('postedBy', 'email name');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.status === 'closed') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  const existing = await Application.findOne({ job: job._id, seeker: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error('You have already applied to this job');
  }

  const application = await Application.create({
    job: job._id,
    seeker: req.user._id,
    coverLetter,
    resumeUrl,
  });

  // Invalidate detail cache so applicantCount updates
  await cacheDel(keys.jobDetail(job._id.toString()));

  const employerEmail = job.postedBy?.email;
  if (employerEmail) {
    const subject = `New application for "${job.title}"`;
    const html = `
      <p>Hi ${job.postedBy.name || 'there'},</p>
      <p><b>${req.user.name}</b> (${req.user.email}) just applied for your posting
      <b>${job.title}</b> at <b>${job.company}</b>.</p>
      ${coverLetter ? `<p><b>Cover letter:</b><br/>${coverLetter.replace(/\n/g, '<br/>')}</p>` : ''}
      <p>Log in to JobBoard to review the application.</p>
    `;
    sendMail({ to: employerEmail, subject, html, text: subject }).catch(() => {});
  }

  res.status(201).json(application);
});

export const myApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ seeker: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'job', select: 'title company location jobType status' })
    .lean();
  res.json({ items: apps });
});

export const applicationsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    res.status(400);
    throw new Error('Invalid jobId');
  }
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the posting employer can view these applications');
  }
  const apps = await Application.find({ job: jobId })
    .sort({ createdAt: -1 })
    .populate({ path: 'seeker', select: 'name email' })
    .lean();
  res.json({ items: apps });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!APP_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`status must be one of: ${APP_STATUSES.join(', ')}`);
  }
  const app = await Application.findById(id).populate('job');
  if (!app) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (app.job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the posting employer can update this application');
  }
  app.status = status;
  await app.save();

  const seeker = await User.findById(app.seeker);
  if (seeker?.email) {
    sendMail({
      to: seeker.email,
      subject: `Your application was updated: ${status}`,
      html: `<p>Hi ${seeker.name}, your application for <b>${app.job.title}</b> is now <b>${status}</b>.</p>`,
      text: `Your application for ${app.job.title} is now ${status}.`,
    }).catch(() => {});
  }

  res.json(app);
});
