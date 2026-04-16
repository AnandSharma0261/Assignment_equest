import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Job, { JOB_TYPES } from '../models/Job.js';
import { cacheGetJSON, cacheSetJSON, cacheDel, cacheDelByPattern, keys } from '../utils/cache.js';

function canonicalListQuery(q) {
  const params = new URLSearchParams();
  const pairs = [
    ['search', q.search?.trim() || ''],
    ['jobType', q.jobType || ''],
    ['location', (q.location || '').trim()],
    ['status', q.status || 'open'],
    ['page', String(Math.max(1, Number(q.page) || 1))],
    ['limit', String(Math.min(50, Math.max(1, Number(q.limit) || 10)))],
    ['sort', q.sort || 'recent'],
  ];
  for (const [k, v] of pairs) if (v !== '') params.set(k, v);
  params.sort();
  return params.toString();
}

export const listJobs = asyncHandler(async (req, res) => {
  const qs = canonicalListQuery(req.query);
  const cacheKey = keys.jobsList(qs);

  const cached = await cacheGetJSON(cacheKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  const parsed = Object.fromEntries(new URLSearchParams(qs));
  const { search, jobType, location, status, page, limit, sort } = parsed;

  const filter = {};
  if (status) filter.status = status;
  if (jobType) {
    const types = jobType.split(',').map((s) => s.trim()).filter(Boolean);
    filter.jobType = types.length > 1 ? { $in: types } : types[0];
  }
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNum - 1) * pageSize;

  const sortSpec = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Job.find(filter)
      .sort(sortSpec)
      .skip(skip)
      .limit(pageSize)
      .populate('postedBy', 'name company')
      .lean(),
    Job.countDocuments(filter),
  ]);

  const payload = {
    items,
    page: pageNum,
    limit: pageSize,
    total,
    pages: Math.ceil(total / pageSize) || 1,
  };

  const ttl = Number(process.env.CACHE_TTL_LIST) || 120;
  await cacheSetJSON(cacheKey, payload, ttl);
  res.set('X-Cache', 'MISS');
  res.json(payload);
});

export const getJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid job id');
  }

  const cacheKey = keys.jobDetail(id);
  const cached = await cacheGetJSON(cacheKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  const job = await Job.findById(id).populate('postedBy', 'name company').lean();
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const ttl = Number(process.env.CACHE_TTL_DETAIL) || 600;
  await cacheSetJSON(cacheKey, job, ttl);
  res.set('X-Cache', 'MISS');
  res.json(job);
});

export const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, jobType, description, salaryMin, salaryMax, salaryCurrency } = req.body;

  if (!title || !company || !location || !jobType || !description) {
    res.status(400);
    throw new Error('title, company, location, jobType, description are required');
  }
  if (!JOB_TYPES.includes(jobType)) {
    res.status(400);
    throw new Error(`jobType must be one of: ${JOB_TYPES.join(', ')}`);
  }

  const job = await Job.create({
    title,
    company: company || req.user.company,
    location,
    jobType,
    description,
    salaryMin,
    salaryMax,
    salaryCurrency,
    postedBy: req.user._id,
  });

  await cacheDelByPattern(keys.jobsListPattern());

  res.status(201).json(job);
});

export const closeJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only close your own job postings');
  }
  job.status = 'closed';
  await job.save();

  await Promise.all([
    cacheDel(keys.jobDetail(id)),
    cacheDelByPattern(keys.jobsListPattern()),
  ]);

  res.json(job);
});

export const listEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ items: jobs });
});
