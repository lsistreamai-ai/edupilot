# EduPilot - Learning Platform Specification

## Users

### Roles
- **Student** - Mobile-first, join class, do activities
- **Teacher** - Desktop sidebar, create content, view reports
- **Admin** - Same as teacher

### Auth Flow
1. Login → Check role → Redirect to dashboard
2. Student → `student-dashboard.html`
3. Teacher/Admin → `teacher-dashboard.html`

---

## Student Journey

### #1 Goal: Join class, complete activities

```
Login → Dashboard → See classes → Click subject → See activities → Complete
```

### Screens
1. **Login/Signup** ✅ (exists)
2. **Student Dashboard** - Show enrolled classes, points/level
3. **Subject View** - 4 subjects with color coding
4. **Activity List** - Quizzes, videos, worksheets
5. **Activity Detail** - Take quiz / Watch video / Submit work

### Subject Colors
| Subject | Color | Hex |
|---------|-------|-----|
| Chinese 中文 | Red | #EF4444 |
| English 英文 | Blue | #3B82F6 |
| Math 數學 | Green | #10B981 |
| Science 常識 | Orange | #F97316 |

---

## Teacher Journey

### #1 Goal: Create content, assign to class, view progress

```
Login → Dashboard → Select class → Create activity OR View reports
```

### Screens
1. **Login/Signup** ✅ (exists)
2. **Teacher Dashboard** - Stats, class list, quick actions
3. **Class Detail** - Students, activities, reports
4. **Create Activity** - Quiz/Video/Worksheet form
5. **Progress Report** - Who completed, scores

---

## Database Schema

### Tables Needed

```sql
-- Users (exists partially)
users (id, email, full_name, role, points, level)

-- Classes
classes (id, name, code, teacher_id, subject)

-- Enrollments
enrollments (id, user_id, class_id, joined_at)

-- Activities
activities (id, class_id, type, title, content, due_date)

-- Submissions
submissions (id, activity_id, user_id, status, score, submitted_at)
```

---

## Tech Stack

- **Frontend**: Static HTML/CSS/JS (no React for now, keep simple)
- **Database**: Supabase (already configured)
- **Hosting**: Vercel (already configured)
- **Auth**: Supabase Auth (working)

---

## Build Order

### ✅ Phase 0: Setup (DONE)
- [x] Supabase project
- [x] Login/signup working
- [x] Admin account created

### 🔄 Phase 1: Core Flow
- [ ] Fix student dashboard (show classes, subjects)
- [ ] Fix teacher dashboard (class management)
- [ ] Test role redirect works

### 📋 Phase 2: Database
- [ ] Create `classes` table
- [ ] Create `enrollments` table
- [ ] Seed demo classes (P4CS21, P4CS22, P5CS11)
- [ ] Connect to dashboards

### 📝 Phase 3: Activities
- [ ] Create `activities` table
- [ ] Create `submissions` table
- [ ] Activity list view (student)
- [ ] Activity create form (teacher)

### 📊 Phase 4: Reports
- [ ] Progress view (teacher)
- [ ] Leaderboard (student)

---

## Current Status

**Working:**
- ✅ Login/signup
- ✅ Email confirmation
- ✅ Role redirect
- ✅ Admin account

**In Progress:**
- ⏳ Student dashboard (needs subjects)
- ⏳ Teacher dashboard (needs class creation)

**Not Started:**
- ❌ Database tables (classes, enrollments, activities, submissions)
- ❌ Activity system
- ❌ Progress reports

---

## Design Guidelines

- **Mobile-first** for students
- **Desktop sidebar** for teachers
- **Large touch targets** (min 48px)
- **Rounded corners** (16-24px)
- **Friendly fonts** (system fonts, 16-18px body)
- **No dark mode** (light only)
- **Bilingual** (EN/中文 toggle on every page)
