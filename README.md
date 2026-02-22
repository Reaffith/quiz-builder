# Quiz Builder

Full-stack quiz creation application.

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14+ (App Router) + TypeScript + SCSS modules
- Features: create quizzes, list quizzes with pagination, view quiz details (read-only), delete quizzes

## Project Structure
quiz-builder/
├── backend/                # NestJS API
│   ├── prisma/
│   ├── src/
│   └── ...
├── frontend/               # Next.js app
│   ├── app/
│   └── ...
└── README.md
text## Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm
- PostgreSQL (local or Docker)
- Git

## Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy example env and fill DATABASE_URL
cp .env.example .env
# or manually create .env with:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quizdb?schema=public"


# Sync schema & generate client
npx prisma generate
npx prisma db push   # or npx prisma migrate dev

# Start development server
npm run start:dev
API will be available at: http://localhost:3001
Frontend Setup
Bashcd frontend

# Install dependencies
npm install

# Copy example env and fill API URL
cp .env.example .env.local
# or manually:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
npm run dev
Frontend will be available at: http://localhost:3000
Running both together
Open two terminals:
Terminal 1 – backend
Bashcd backend && npm run start:dev
Terminal 2 – frontend
Bashcd frontend && npm run dev
Useful commands
Bash# Backend only
cd backend
npm run start:dev        # watch mode
npx prisma studio        # open DB GUI in browser
npx prisma generate      # regenerate client after schema change
Bash# Frontend only
cd frontend
npm run dev              # start dev server
npm run build            # production build
npm run start            # run production build
Default ports

Backend API → http://localhost:3001
Frontend     → http://localhost:3000

Development notes
