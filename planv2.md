# ENARM V2 Implementation Plan

This document outlines the implementation plan, progress, and technical requirements for the ENARM V2 upgrade.

## 1. UI/UX Strategy: Material Design 3 (MD3) Evolution

The goal is to modernize the ENARM platform using Material Design 3 principles, focusing on:
- **Emerald Green Theme:** Using #0fa397 as the primary brand color.
- **Typography:** Using "Figtree" (or similar modern sans-serif) for a cleaner look.
- **Elevation & Surface:** Utilizing MD3 surface tones instead of harsh shadows.
- **Responsive Layout:** Mobile-first approach with a dedicated Navigation Rail for desktop.

## 2. Completed Implementation (Frontend)

### Core Infrastructure
- [x] **v2-theme.css**: Implementation of MD3 CSS variables and utility classes.
- [x] **V2App Layout**: Main layout container for V2 pages.
- [x] **V2Navi**: Navigation rail/bottom nav for V2.
- [x] **AppRoutes.jsx Integration**: Added V2 routes with priority over V1.

### Pages (Implemented)
- [x] **V2Landing**: High-conversion landing page.
- [x] **V2Login / V2Signup**: Dedicated V2 auth flow.
- [x] **V2PlayerDashboard**: Data-rich dashboard with stats and activity.
- [x] **V2MockExamSetup**: Configuration for personalized practice sessions.
- [x] **V2Examen**: Immersive exam experience.
- [x] **V2SessionSummary**: Detailed post-exam analytics.
- [x] **V2Profile**: Modernized user settings.
- [x] **V2Onboarding**: Specialty and goal selection.
- [x] **V2Contribuir / V2MisContribuciones**: Improved contribution workflow.
- [x] **V2ForgotPassword**: Password recovery flow.
- [x] **V2NationalLeaderboard**: Ranking global de usuarios. (Basada en "National Leaderboard Screen")
- [x] **V2ImageBank**: Galería de imágenes médicas para estudio. (Basada en "Mobile Image Bank View")
- [x] **V2FlashcardStudy**: Interfaz de repaso de flashcards con SRS. (Basada en "Mobile Flashcard Study View")
- [x] **V2KnowledgeBase**: Base de conocimientos médicos. (Basada en "Mobile Knowledge Base View")
- [x] **V2ErrorReview**: Revisión detallada de errores cometidos. (Basada en "Mobile Error Review View")

### Pages (In Progress / Pending from Stitch)
- [/] **V2PublicProfile**: Perfil público de usuarios. (Implementación base con datos simulados)
- [/] **V2Checkout**: Flujo de pago para suscripciones. (Implementación base + diseño para Stripe)

## 3. Backend Requirements (Proposed Endpoints)

See `backend_tasks.md` for detailed payload and response specifications.

### Dashboard & Stats
- `GET /v2/stats/summary`
- `GET /v2/activity/recent`

### Exam Sessions (Simulacros)
- `POST /v2/exams/sessions`
- `GET /v2/exams/sessions/:id`
- `GET /v2/exams/sessions/:id/analytics`

### Gamification & Community
- `GET /v2/leaderboard/national`: For V2NationalLeaderboard.
- `GET /v2/images/bank`: For V2ImageBank.
- `GET /v2/users/:id/public-profile`: For V2PublicProfile.

### Study Materials
- `GET /v2/flashcards/review`: For V2FlashcardStudy.
- `GET /v2/knowledge-base`: For V2KnowledgeBase.
- `GET /v2/errors/summary`: For V2ErrorReview.

### Payments
- `POST /v2/payments/create-checkout-session`: Stripe Integration (Planned).

## 4. Progress Log
- **2023-10-XX**: Initial exploration and setup of V2 structure.
- **2023-10-XX**: Implementation of core MD3 theme and Landing page.
- **2023-10-XX**: Development of Auth, Dashboard, and Exam flows.
- **2023-10-XX**: Route integration and fix of import collisions.
- **2024-05-22**: Mapping of Stitch screens and planning of 5 new pages.
- **2024-05-23**: Refinement of Leaderboard, ImageBank, Flashcards, KnowledgeBase and ErrorReview. Starting PublicProfile and Checkout.
