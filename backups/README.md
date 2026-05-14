# EduPilot HTML Backups

## Files in this folder:

| File | Description |
|------|-------------|
| index-20260515-0137.html | Login page with Student/Teacher toggle |
| student-20260515-0137.html | Student dashboard with skills, awards, leaderboard |
| teacher-20260515-0137.html | Teacher dashboard with classes, quick actions |

## How to Restore:

```bash
# Restore login page
cp backups/index-20260515-0137.html index.html
cp backups/index-20260515-0137.html public/index.html

# Restore student dashboard
cp backups/student-20260515-0137.html student-dashboard.html
cp backups/student-20260515-0137.html public/student-dashboard.html

# Restore teacher dashboard  
cp backups/teacher-20260515-0137.html teacher-dashboard.html
cp backups/teacher-20260515-0137.html public/teacher-dashboard.html
```

## Current Data:

### Login Page:
- Role toggle (Student/Teacher)
- Sign in / Sign up forms
- Grade selection (P1-P6, S1-S6)
- Subject selection (Chinese, English, Math, etc.)

### Student Dashboard:
- Welcome: "Hi, Tommy! 👋"
- Level 5, 7-day streak, Rank #24
- Skills: Fractions (75%), Past Tense (60%), 閱讀理解 (45%), Plants (30%)
- Recent awards: 🏆⭐🎯🔥💪📚🎓💡
- Leaderboard: Emily Wong (2,450), Jason Lee (2,320), Sophie Chan (2,180)...

### Teacher Dashboard:
- Welcome: "Mr. Patrick! 👨‍🏫"
- Primary 4 - Chinese & Math
- 42 students, 3 classes, 89% avg score
- Classes: P4A-Chinese (18 students, 92% avg), P4B-Math (15 students, 88% avg)
- Student progress: Emily Wong (98%), Jason Lee (72%), Sophie Chan (95%)...
