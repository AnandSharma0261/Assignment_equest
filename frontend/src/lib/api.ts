import type { JobFilters, Job, JobListResponse, Application, User } from './types';

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const INTERNAL_BASE =
  process.env.API_INTERNAL_URL || PUBLIC_BASE;

function baseUrl() {
  return typeof window === 'undefined' ? INTERNAL_BASE : PUBLIC_BASE;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type FetchOpts = RequestInit & {
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  cookieHeader?: string;
};

async function request<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = `${baseUrl()}${path}`;
  const headers = new Headers(opts.headers);
  if (opts.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (opts.cookieHeader) headers.set('Cookie', opts.cookieHeader);

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: 'include',
  });

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const msg = (data && typeof data === 'object' && 'message' in data)
      ? String((data as { message: unknown }).message)
      : `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}

function buildQuery(filters: JobFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.jobType) params.set('jobType', filters.jobType);
  if (filters.location) params.set('location', filters.location);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.sort) params.set('sort', filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string; role: 'seeker' | 'employer'; company?: string }) =>
    request<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () =>
    request<{ ok: true }>('/auth/logout', { method: 'POST' }),

  me: (cookieHeader?: string) =>
    request<{ user: User }>('/auth/me', { cache: 'no-store', cookieHeader }),

  // Jobs
  listJobs: (filters: JobFilters = {}, init: Partial<FetchOpts> = {}) =>
    request<JobListResponse>(`/jobs${buildQuery(filters)}`, init),

  getJob: (id: string, init: Partial<FetchOpts> = {}) =>
    request<Job>(`/jobs/${id}`, init),

  createJob: (body: Partial<Job>) =>
    request<Job>('/jobs', { method: 'POST', body: JSON.stringify(body) }),

  closeJob: (id: string) =>
    request<Job>(`/jobs/${id}/close`, { method: 'PATCH' }),

  myPostedJobs: (cookieHeader?: string) =>
    request<{ items: Job[] }>('/jobs/mine/posted', { cache: 'no-store', cookieHeader }),

  // Applications
  apply: (body: { jobId: string; coverLetter?: string; resumeUrl?: string }) =>
    request<Application>('/applications', { method: 'POST', body: JSON.stringify(body) }),

  myApplications: (cookieHeader?: string) =>
    request<{ items: Application[] }>('/applications/mine', { cache: 'no-store', cookieHeader }),

  applicationsForJob: (jobId: string, cookieHeader?: string) =>
    request<{ items: Application[] }>(`/applications/job/${jobId}`, { cache: 'no-store', cookieHeader }),

  updateApplicationStatus: (id: string, status: 'applied' | 'shortlisted' | 'rejected' | 'hired') =>
    request<Application>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
