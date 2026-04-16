# JobBoard

A full stack job listing app built for the eQuest MERN practical.

Users can browse jobs, search, filter, and apply. Employers can post jobs, close them, and track applications.

## Stack

- Frontend: Next.js (App Router) + Tailwind
- Backend: Node.js + Express
- Database: MongoDB
- Cache: Redis
- Auth: JWT in HttpOnly cookie
- Email: Nodemailer over Gmail SMTP

## Folder structure

```
Assignment_equest
├── backend/    Express API
└── frontend/   Next.js app
```

## How to run

You need Node 18+, MongoDB and Redis running locally (or any Redis Cloud URL).

### 1. Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment files

.env files are gitignored so they will not show up after you clone. Create them with the values below. These are the same values I am using for development.

**backend/.env**

```
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/jobboard
REDIS_URL=redis://127.0.0.1:6379

JWT_SECRET=dev_only_secret_change_me_in_prod_9f8e7d6c5b4a
JWT_EXPIRES_IN=7d
COOKIE_NAME=jb_token

CLIENT_ORIGIN=http://localhost:3000

CACHE_TTL_LIST=120
CACHE_TTL_DETAIL=600

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="JobBoard <no-reply@jobboard.local>"
```

Email sending is optional. To try the notification feature, put a Gmail address in `SMTP_USER` and a Gmail app password in `SMTP_PASS`. If you leave them blank the app still works, it just skips sending the mail.

**frontend/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_INTERNAL_URL=http://localhost:5000/api
```

### 3. Seed the database

Make sure MongoDB and Redis are running. Then:

```bash
cd backend
npm run seed
```

This wipes the collections and creates 12 jobs, 3 employers and 2 seekers.

Test accounts (both use password `Passw0rd!`):

- Employer: `acme@employer.com`
- Seeker: `ananya@seeker.com`

### 4. Start the servers

In one terminal:

```bash
cd backend
npm run dev
```

In another:

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Features Done


- [x] Job listing page with title, company, location, type and posted date
- [x] Search by title or keyword
- [x] Filter by job type and location
- [x] Job detail page
- [x] JWT auth with HttpOnly cookie
- [x] Separate roles for seeker and employer
- [x] Employer can post a job (role protected)
- [x] Seeker can apply to a job (role protected), application saved in MongoDB
- [x] Redis caching on list and detail endpoints with TTL
- [x] Cache invalidation when a new job is posted



- [x] Responsive design
- [x] ISR on the job listing page
- [x] SSR on the job detail page
- [x] Seeker can see their own applications
- [x] Employer can see all applications on their jobs
- [x] Debounced search input
- [x] Pagination on the listings

### Bonus Done

- [x] Email notification to the employer when a seeker applies (Nodemailer + Gmail SMTP)
- [x] Employer can close a job, after which new applications are blocked
- [x] Application status tracking (Shortlisted, Rejected, Hired)

## API endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id/close
GET    /api/jobs/mine/posted

POST   /api/applications
GET    /api/applications/mine
GET    /api/applications/job/:jobId
PATCH  /api/applications/:id/status
```

## Caching approach

- `GET /api/jobs` is cached with a key built from the filter and pagination params. TTL is 120 seconds.
- `GET /api/jobs/:id` is cached per job id. TTL is 600 seconds.
- When an employer posts a new job, all list cache keys are cleared so the new job shows up right away.
- When an application is created or a job is closed, the detail cache for that job is cleared so `applicantCount` and status stay correct.

Why these TTLs: listings change often as new jobs come in, so a short TTL (2 min) keeps things fresh without hammering Mongo. A single job changes less often so 10 min is enough, and invalidation handles the important writes anyway.

## Rendering strategy

- `/jobs` (listing): ISR with 60 second revalidation. The page is mostly read heavy, search and filter work through query params so the shell stays cached and reacts to URL changes.
- `/jobs/[id]` (detail): SSR. Fetched on every request so status and applicant count are always current. The Redis cache on the API means this is still fast.
- Auth pages, apply form, employer dashboard and application lists: client side or SSR with `no-store` because they are user specific and change with every action.

## Seed data

The seed script creates 12 jobs across 5 job types (full-time, part-time, remote, contract, internship) and 6 locations. Two demo applications are also created so the employer dashboard has something to show on first login.

## Walkthrough

Loom free plan only lets me record 5 minutes per video, so the walkthrough is split into two parts.

- Part 1: https://www.loom.com/share/f21bb8640b0449afbea3f4eb4bd1abcb
- Part 2: https://www.loom.com/share/be70a4ea100942fb88c6ad9ea355e651

## Submission checklist

- [x] App runs locally with the steps in this README
- [x] All must-have features working
- [x] `.env.example` included for both backend and frontend
- [x] 5+ meaningful commits
- [x] Loom walkthrough links above
