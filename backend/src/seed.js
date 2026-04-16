import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import { connectDB } from './config/db.js';

const employers = [
  { name: 'Acme Recruiter', email: 'acme@employer.com', password: 'Passw0rd!', role: 'employer', company: 'Acme Corp' },
  { name: 'Globex HR', email: 'globex@employer.com', password: 'Passw0rd!', role: 'employer', company: 'Globex' },
  { name: 'Initech Hiring', email: 'initech@employer.com', password: 'Passw0rd!', role: 'employer', company: 'Initech' },
];

const seekers = [
  { name: 'Ananya Sharma', email: 'ananya@seeker.com', password: 'Passw0rd!', role: 'seeker' },
  { name: 'Rahul Verma', email: 'rahul@seeker.com', password: 'Passw0rd!', role: 'seeker' },
];

const jobsBlueprint = [
  { title: 'Senior Frontend Engineer', location: 'Bengaluru, India', jobType: 'full-time', salaryMin: 2500000, salaryMax: 4500000, description: 'Own large parts of our React + Next.js app. Ship features, mentor juniors, and care about performance.' },
  { title: 'Backend Engineer (Node.js)', location: 'Remote', jobType: 'remote', salaryMin: 2000000, salaryMax: 3800000, description: 'Build Node/Express services backed by MongoDB and Redis. Strong caching and API design skills required.' },
  { title: 'Full Stack Developer', location: 'Pune, India', jobType: 'full-time', salaryMin: 1800000, salaryMax: 3200000, description: 'Work across the stack using Next.js, Node.js, and MongoDB. Comfortable with ISR/SSR tradeoffs.' },
  { title: 'DevOps Engineer', location: 'Hyderabad, India', jobType: 'full-time', salaryMin: 2200000, salaryMax: 3800000, description: 'Manage CI/CD, AWS infra, Redis + Mongo clusters. IaC experience with Terraform a plus.' },
  { title: 'UI/UX Designer (Part-time)', location: 'Remote', jobType: 'part-time', salaryMin: 800000, salaryMax: 1400000, description: 'Design flows in Figma, collaborate with engineering, iterate on a component library.' },
  { title: 'QA Automation Engineer', location: 'Bengaluru, India', jobType: 'full-time', salaryMin: 1500000, salaryMax: 2800000, description: 'Build Cypress/Playwright suites, own release testing and regression pipelines.' },
  { title: 'Mobile Engineer (React Native)', location: 'Mumbai, India', jobType: 'contract', salaryMin: 1800000, salaryMax: 2800000, description: '3-month contract to ship a v1 of our RN app. Strong TypeScript required.' },
  { title: 'Data Engineer Intern', location: 'Remote', jobType: 'internship', salaryMin: 400000, salaryMax: 600000, description: '6-month internship working on data pipelines, SQL, and Python. Great learning opportunity.' },
  { title: 'Product Manager', location: 'Gurgaon, India', jobType: 'full-time', salaryMin: 2800000, salaryMax: 4500000, description: 'Own a product line end-to-end. Work with design, engineering, and GTM.' },
  { title: 'Customer Support Specialist', location: 'Remote', jobType: 'part-time', salaryMin: 600000, salaryMax: 900000, description: 'Answer tickets, build docs, own CSAT on our SMB tier.' },
  { title: 'Site Reliability Engineer', location: 'Bengaluru, India', jobType: 'full-time', salaryMin: 3000000, salaryMax: 5000000, description: 'Own SLOs, run postmortems, build tooling. On-call rotation included.' },
  { title: 'Technical Writer', location: 'Remote', jobType: 'part-time', salaryMin: 700000, salaryMax: 1200000, description: 'Write API docs, guides, and tutorials for our developer audience.' },
];

async function run() {
  await connectDB(process.env.MONGO_URI);
  console.log('[seed] clearing collections');
  await Promise.all([User.deleteMany({}), Job.deleteMany({}), Application.deleteMany({})]);

  const employerDocs = await User.create(employers);
  const seekerDocs = await User.create(seekers);
  console.log(`[seed] created ${employerDocs.length} employers, ${seekerDocs.length} seekers`);

  const jobs = jobsBlueprint.map((j, i) => ({
    ...j,
    company: employerDocs[i % employerDocs.length].company,
    salaryCurrency: 'INR',
    postedBy: employerDocs[i % employerDocs.length]._id,
    status: 'open',
  }));
  const jobDocs = await Job.insertMany(jobs);
  console.log(`[seed] created ${jobDocs.length} jobs`);

  await Application.create([
    { job: jobDocs[0]._id, seeker: seekerDocs[0]._id, coverLetter: 'Excited to apply!', status: 'applied' },
    { job: jobDocs[1]._id, seeker: seekerDocs[0]._id, coverLetter: 'Strong Node.js background.', status: 'shortlisted' },
  ]);

  console.log('[seed] done');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] error', err);
  process.exit(1);
});
