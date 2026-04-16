export type Role = 'seeker' | 'employer';

export type JobType = 'full-time' | 'part-time' | 'remote' | 'contract' | 'internship';

export const JOB_TYPES: JobType[] = [
  'full-time',
  'part-time',
  'remote',
  'contract',
  'internship',
];

export type JobStatus = 'open' | 'closed';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: string;
  createdAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string[];
  aboutTeam?: string;
  industry?: string;
  companyTagline?: string;
  applicantCount?: number;
  status: JobStatus;
  postedBy?: { _id: string; name: string; company?: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  items: Job[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Application {
  _id: string;
  job: Job | string;
  seeker: User | string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  jobType?: JobType | '';
  location?: string;
  page?: number;
  limit?: number;
  sort?: 'recent' | 'oldest';
}
