# JobBoard — Full Stack Practical Assignment

**Duration:** 8 Hours
**Mode:** Work From Home
**Stack:** Next.js · Node.js · Express.js · MongoDB · Redis

---

## Overview

Build a job listing web application called **JobBoard**.

The application should allow users to browse job postings, search and filter by role or location, apply for jobs, and allow employers to post new listings. The backend should be performant with caching applied where appropriate, and the frontend should use Next.js with deliberate rendering strategy choices per page.

---

## Design Reference

The UI design is provided as a Figma file. Your implementation should follow this design.

🔗 **Figma Link:** [Click here to view the design](https://www.figma.com/design/G3M2HlarjjkX34jVix9Kir/eQuest-Solutions---MERN-Stack-Practical---Jobs-Board?t=dQNrO0IeLWQVx4i4-1)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Caching | Redis (local or Redis Cloud free tier) |
| Styling | Tailwind CSS |
| Auth | JWT + HttpOnly Cookies |

---

## Features

### 🔴 Must Have

- Job listing page — display jobs with title, company name, location, job type (full-time/part-time/remote), and date posted
- Search jobs by title or keyword
- Filter by job type and location
- Job detail page — full details of a single job posting
- JWT-based authentication — separate roles for **Job Seeker** and **Employer**
- Token stored in HttpOnly cookie
- Employer can post a new job (protected — employer role only)
- Job Seeker can apply for a job (protected — seeker role only), application saved to MongoDB
- Redis caching on the job listing and job detail API endpoints with appropriate TTL
- Cache invalidation when a new job is posted

### 🟡 Good to Have

- Responsive design
- ISR or SSG for the job listing page with appropriate revalidation strategy
- SSR for the job detail page
- Job Seeker can view their submitted applications
- Employer can view all applications received for their job postings
- Debounced search input
- Pagination on the job listings

### 🟢 Bonus

- Email notification on application (use Nodemailer with a free Gmail SMTP — no paid service)
- Employer can mark a job as closed — no new applications accepted
- Application status tracking — employer can update status to Shortlisted, Rejected, or Hired

---

## Backend Endpoints

Your Express backend should expose at minimum the following. You are free to add more as needed.

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/jobs               → All job listings (cached in Redis)
GET    /api/jobs/:id           → Single job detail (cached in Redis)
POST   /api/jobs               → Post a new job (employer only)

POST   /api/applications       → Apply for a job (seeker only)
GET    /api/applications/mine  → Seeker's submitted applications (protected)
GET    /api/applications/job/:jobId  → All applications for a job (employer only)
```

---

## Caching Requirements

This is a core part of the assessment.

- `GET /api/jobs` and `GET /api/jobs/:id` must use Redis to cache responses
- Cached data should have a suitable TTL
- When a new job is posted via `POST /api/jobs`, the job listing cache should be invalidated
- Be prepared to explain your caching approach and TTL decisions in your walkthrough

---

## Rendering Strategy

Be deliberate about which Next.js rendering strategy you use for each page and be prepared to justify your choices during the review.

- Consider which pages benefit from SSR, SSG, or ISR
- Consider which pages require client-side rendering
- This is evaluated — not just whether it works, but why you made each choice

---

## Seed Data

Seed your database with at least 10 job postings across at least 3 job types and 3 locations. You can use a seed script or add data manually. Each job should include: title, company, location, job type, description, salary range (optional), and date posted.

---

## Environment Variables

Never hardcode credentials or secrets in your source code. Use `.env` files and add them to `.gitignore`. Include a `.env.example` with all required variable names but no actual values.

---

## Rules

1. AI tools are allowed — Copilot, ChatGPT, Cursor, and similar are permitted
2. You are fully responsible for understanding and explaining every part of the code you submit
3. Do not copy entire project templates or boilerplates from GitHub
4. Make meaningful commits throughout — your commit history is part of the evaluation
5. Submit a Loom video (5–7 minutes) walking through the running application and explaining your key decisions — particularly around caching, cache invalidation, rendering strategy, and role-based authentication
6. Add the Loom link to this README under a `## Walkthrough` section before your final push

---

## Submission Checklist

Before submitting, ensure the following:

- [ ] App runs locally with setup instructions in this README
- [ ] All must-have features are working
- [ ] `.env.example` file is included
- [ ] At least 5 meaningful commits in the history
- [ ] Loom walkthrough video link added to this README

---

Good luck.
