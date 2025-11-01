# School Timetable Builder

A complete timetable management system for schools built with Node.js, Express, TypeScript, Next.js, and Tailwind CSS.

## Features

### Core Features
- ✅ Add/edit timetable entries for classes
- ✅ Visual weekly grid (Mon-Sat × Period 1-8)
- ✅ Teacher conflict validation
- ✅ Period limit enforcement (max 8/day)
- ✅ Subject coverage tracking
- ✅ Responsive design (mobile-friendly)

### Bonus Features
- ✅ Auto-suggest available slots for teachers
- ✅ Highlight missing subjects in red
- ✅ Export timetable as CSV
- ✅ Subject coverage summary

## Architecture

### Backend (Node.js + Express + TypeScript)
```
/backend
├── src/
│   ├── index.ts              # Main server file
│   ├── types/index.ts        # TypeScript interfaces
│   ├── routes/timetable.ts   # API routes
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   └── data/                 # JSON storage & config
└── package.json
```

### Frontend (Next.js + Tailwind + Shadcn/UI)
```
/frontend
├── pages/
│   ├── timetable.tsx         # Main timetable page
│   └── _app.tsx              # App wrapper with providers
├── components/
│   ├── TimetableGrid.tsx     # Visual grid component
│   ├── TimetableForm.tsx     # Entry form component
│   └── ui/                   # Reusable UI components
├── hooks/useTimetable.ts     # React Query hooks
├── lib/api.ts                # API client
└── types/index.ts            # TypeScript types
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MONGODB_URI
echo "MONGODB_URI=mongodb://localhost:27017/timetable-builder" > .env
npm run dev
```
Server runs on http://localhost:3001

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

## API Endpoints

- `POST /api/timetable` - Create/update timetable entry
- `GET /api/timetable/:className` - Get class timetable
- `GET /api/config` - Get classes, subjects, teachers
- `GET /api/coverage/:className` - Get subject coverage
- `GET /api/suggest-slots?teacher=name` - Get available slots

## Validation Rules

1. **Teacher Conflict**: A teacher cannot teach two classes simultaneously
2. **Period Limit**: Maximum 8 periods per day per class
3. **Slot Conflict**: One subject per class per time slot
4. **Subject Coverage**: Track sessions per subject per week

## Data Storage

Uses MongoDB for persistent data storage. All timetable entries are stored in a MongoDB collection with proper indexing for performance and data integrity.

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Environment configuration

**Frontend:**
- Next.js 14
- TanStack Query (React Query)
- Tailwind CSS
- Shadcn/UI components
- React Hot Toast

## Usage

1. Select a class from the dropdown
2. Choose teacher, subject, day, and period
3. Click "Add Session" to create entry
4. View the visual grid with all sessions
5. Export timetable as CSV
6. Use auto-suggestions for available teacher slots

## Error Handling

- Descriptive validation errors (e.g., "Mr. Ravi Menon already assigned to Class 9A on Tuesday, Period 3")
- Toast notifications for success/error feedback
- Loading states and error boundaries

## Mobile Responsive

- Grid scrolls horizontally on mobile
- Form adapts to smaller screens
- Touch-friendly interface