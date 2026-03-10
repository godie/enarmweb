# ENARM V2 Implementation Plan

This document outlines the implementation plan, progress, and technical requirements for the ENARM V2 upgrade.

## 1. UI/UX Strategy: Material Design 3 (MD3) Evolution

The goal is to modernize the ENARM platform using Material Design 3 principles, focusing on:
- **Emerald Green Theme:** Using `#0fa397` as the primary brand color.
- **Typography:** Using "Figtree" (or similar modern sans-serif) for a cleaner look.
- **Elevation & Surface:** Utilizing MD3 surface tones instead of harsh shadows.
- **Responsive Layout:** Mobile-first approach with a dedicated Navigation Rail for desktop.

## 2. Completed Implementation (Frontend)

### Core Infrastructure
- [x] **v2-theme.css**: Implementation of MD3 CSS variables and utility classes.
- [x] **V2App Layout**: Main layout container for V2 pages.
- [x] **V2Navi**: Navigation rail/bottom nav for V2.
- [x] **AppRoutes.jsx Integration**: Added V2 routes with priority over V1.

### Pages
- [x] **V2Landing**: High-conversion landing page.
- [x] **V2Login / V2Signup**: Dedicated V2 auth flow.
- [x] **V2PlayerDashboard**: Data-rich dashboard with stats and activity.
- [x] **V2MockExamSetup**: Configuration for personalized practice sessions.
- [x] **V2Examen**: Immersive exam experience.
- [x] **V2SessionSummary**: Detailed post-exam analytics.
- [x] **V2Profile**: Modernized user settings.
- [x] **V2Onboarding**: Specialty and goal selection.
- [x] **V2Contribuir / V2MisContribuciones**: Improved contribution workflow.

## 3. Backend Requirements (Proposed Endpoints)

To fully support V2 features, the following new or updated endpoints are requested:

### Dashboard & Stats
- `GET /v2/stats/summary`: Returns aggregated stats (accuracy, percentile, progress by specialty) for the new dashboard cards.
- `GET /v2/activity/recent`: List of recent exam sessions and contributions.

### Exam Sessions (Simulacros)
- `POST /v2/exams/sessions`: Create a new exam session based on configuration (mode, specialty, number of questions).
- `GET /v2/exams/sessions/:id`: Retrieve detailed results for a specific session.
- `GET /v2/exams/sessions/:id/analytics`: Specific behavioral analytics (time per question, strength/weakness detection).

### Gamification
- `GET /v2/ranking/global`: Global user ranking.
- `GET /v2/ranking/specialty/:id`: Specialty-specific ranking.

### Contributions
- `GET /v2/users/me/contributions/stats`: Stats on accepted vs. pending contributions.

## 4. Pending Tasks
- [ ] **Visual Verification**: Comprehensive walkthrough of all V2 pages on mobile and desktop.
- [ ] **Dark Mode Polish**: Ensure all surface tones are correct in dark mode.
- [ ] **Accessibility Audit**: Verify ARIA labels and keyboard navigation for new components.
- [ ] **Backend Integration**: Switch from mock data to the proposed endpoints once available.

## 5. Progress Log
- **2023-10-XX**: Initial exploration and setup of V2 structure.
- **2023-10-XX**: Implementation of core MD3 theme and Landing page.
- **2023-10-XX**: Development of Auth, Dashboard, and Exam flows.
- **2023-10-XX**: Route integration and fix of import collisions.
