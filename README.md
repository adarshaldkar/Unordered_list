# EduMark Pro — Institutional Examination & Marks Management System

An intelligent, modern school mark sheet management portal designed to ingest **unordered client Excel spreadsheets**, automatically reorder curriculum subjects, compute grades, ranks, percentages, and totals, and export clean Excel reports and printable student report cards.

---

## ✨ Features

- **Smart Unordered Excel Ingestion:** Automatically maps and normalizes scrambled Excel columns (e.g. Science before Tamil, arbitrary row order).
- **Curriculum Subject Ordering:** Auto-arranges subjects into standard sequence:
  `1. Tamil` &rarr; `2. English` &rarr; `3. Mathematics` &rarr; `4. Science` &rarr; `5. Social Science`.
- **Auto-Calculations Engine:**
  - Total Marks (out of 500)
  - Percentage (%)
  - Subject-wise and Overall Grades (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`)
  - Pass/Fail Status (Minimum passing mark: 35)
  - Class Rank calculation (Gold 🥇, Silver 🥈, Bronze 🥉 badges)
- **Mark Locking Security:** Toggle to lock finalized marks and prevent tampering or unauthorized edits.
- **Official Report Cards:** Printable / Save-as-PDF ready official student report cards with school crest, remarks, and signature spaces.
- **Raw vs. Ordered View Comparison:** Easily compare messy source input with the standardized system view.
- **Export Clean Excel:** Instant download of normalized, structured master marksheets.
- **Real-Time Filtering & Search:** Search by student name or admission number, filter by class, section, or pass/fail result.

---

## 🚀 Live Demo Deployment (GitHub Pages)

Because this application uses standard HTML, CSS, and Vanilla JavaScript with CDN dependencies (SheetJS & FontAwesome), it can be deployed on **GitHub Pages in under 1 minute** with zero build configuration!

### Quick Steps to Deploy:
1. Create a new repository on GitHub (e.g., `edumark-pro`).
2. Push this project to your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. Go to **Settings** &rarr; **Pages** in your GitHub repository.
4. Under **Source**, select **Deploy from a branch** & choose `main` branch with `/ (root)` folder.
5. Click **Save**. Within 60 seconds, your live demo will be live at:
   `https://<your-username>.github.io/<repo-name>/`

---

## 🛠 Tech Stack
- **Structure:** Semantic HTML5
- **Styling:** Vanilla CSS (Custom modern design system, responsive, print-optimized)
- **Logic:** Vanilla JavaScript (SheetJS for client-side Excel parsing/export, Canvas-Confetti)
- **Zero build steps required!**
