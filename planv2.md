# ENARM V2 Implementation Plan

This document outlines the implementation plan, progress, and technical requirements for the ENARM V2 upgrade.

## 1. UI/UX Strategy: Material Design 3 (MD3) Evolution

The goal is to modernize the ENARM platform using Material Design 3 principles, focusing on:
- **Emerald Green Theme:** Using #0fa397 as the primary brand color.
- **Typography:** Using "Figtree" (or similar modern sans-serif) for a cleaner look.
- **Elevation & Surface:** Utilizing MD3 surface tones instead of harsh shadows.
- **Responsive Layout:** Mobile-first approach with a dedicated Navigation Rail for desktop.

## 2. Implementation Status (Frontend)

### Core Infrastructure
- [x] **v2-theme.css**: Implementation of MD3 CSS variables and utility classes. (2023-10)
- [x] **V2App Layout**: Main layout container for V2 pages. (2023-10)
- [x] **V2Navi**: Navigation rail/bottom nav for V2. (2023-10)
- [x] **AppRoutes.jsx Integration**: Added V2 routes with priority over V1. (2023-10)

### Player Pages (Completed)
- [x] **V2Landing**: High-conversion landing page. (2023-10)
- [x] **V2Login / V2Signup**: Dedicated V2 auth flow. (2023-10)
- [x] **V2PlayerDashboard**: Data-rich dashboard with stats and activity. (2023-10)
- [x] **V2MockExamSetup**: Configuration for personalized practice sessions. (2023-10)
- [x] **V2Examen**: Immersive exam experience. (2023-10)
- [x] **V2SessionSummary**: Detailed post-exam analytics. (2023-10)
- [x] **V2Profile**: Modernized user settings. (2023-10)
- [x] **V2Onboarding**: Specialty and goal selection. (2023-10)
- [x] **V2Contribuir / V2MisContribuciones**: Improved contribution workflow. (2023-10)
- [x] **V2ForgotPassword**: Password recovery flow. (2023-10)
- [x] **V2NationalLeaderboard**: Ranking global de usuarios. (2024-05-22)
- [x] **V2ImageBank**: Galería de imágenes médicas para estudio. (2024-05-22)
- [x] **V2FlashcardStudy**: Interfaz de repaso de flashcards con SRS. (2024-05-22)
- [x] **V2KnowledgeBase**: Base de conocimientos médicos. (2024-05-22)
- [x] **V2ErrorReview**: Revisión detallada de errores cometidos. (2024-05-22)
- [x] **V2CaseStudy**: Detailed clinical case review with question feedback. (2025-03-05)
- [x] **V2DirectMessaging**: Messaging interface for support and community. (2025-03-05)
- [x] **V2SubscriptionManagement**: Management of active plan and billing. (2025-03-05)
- [x] **V2PublicProfile**: User public profile (Integrated with API). (2025-03-05)
- [x] **V2Checkout**: Payment flow via Stripe. (2025-03-05)

### Player Pages (New - March 2025 Expansion)
- [ ] **V2CouponCenter**: Interface for managing discount coupons. (Pending)
- [ ] **V2FlashcardCreator**: Manual flashcard creation tool. (Pending)
- [ ] **V2AIFlashcardGenerator**: AI-powered flashcard generation interface. (Pending)

### Admin Pages (Base Implementation - March 2025)
- [ ] **V2AdminDashboard**: Main dashboard for administrators. (Pending)
- [ ] **V2AdminUsers**: Base user management interface. (Pending)

## 3. Backend Integration (Status)

All Player-related endpoints described in `backend_tasks.md` are considered **COMPLETED** as of March 2025.

## 4. Progress Log
- **2023-10**: Initial V2 structure, MD3 theme, Auth, Dashboard.
- **2024-05**: Mapping of Stitch screens; Leaderboard, ImageBank, Flashcards, KnowledgeBase.
- **2025-03-05**: Implementation of CaseStudy, Messaging, Subscription, Profile/Checkout API integration.
- **2025-03-06**: Identification of missing screens from Stitch (CouponCenter, FlashcardCreator, Admin base).
