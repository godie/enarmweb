# Spec: Migrar V2 como Experiencia Principal

**Fecha:** 2026-02-12  
**Objetivo:** Hacer que la interfaz V2 (Material Design 3) sea la experiencia principal y única de la plataforma, eliminando completamente la capa V1 (Materialize CSS), reestructurando las rutas sin prefijo `/v2/`, e integrando todos los flujos con la API real del backend.

---

## 1. Decisions Summary

| Decision | Choice |
|---|---|
| Estrategia V1 vs V2 | V2 reemplaza V1 completamente. V1 se elimina. |
| Estructura de URLs | Sin prefijo `/v2/`. Las rutas V2 se convierten en la raíz: `/`, `/login`, `/dashboard`, `/caso/:id` |
| Redirect de auth | `PlayerRoute` y `PrivateRoute` redirigen a `/login` (V2) |
| Admin login | Unificado: admins usan el mismo login V2, el rol se determina en backend |
| Mock data | Conectar TODO a API real. Eliminar datos hardcodeados. |
| Onboarding API | Integrar con `UserService.updateUser()` para guardar especialidad y año |
| Contribuir API | Integrar envío de formulario con backend en `V2Contribuir` |
| Admin CRUD | Migrar TODAS las pantallas admin de V1 a V2 de una vez |
| Layout V1 | Eliminar `App.jsx` y `Navi.jsx` completamente |
| Social login | Agregar Google Login y Facebook Login a V2Login y V2Signup |
| EspecialidadCasos | Crear nueva página `V2EspecialidadCasos` dedicada |
| Logout redirect | Redirigir a landing page (`/`) |
| Custom* V1 | Eliminar todos los componentes Custom* de V1. Crear equivalentes MD3 donde V2 los necesite (ej: CustomPreloader → V2Preloader) |
| Nav por rol | V2Navi filtra items según rol: players ven items de player, admins ven admin+player |
| Examen multi-pregunta | V2Examen soporta navegación pregunta por pregunta con estado de sesión completo |
| Session data | V2SessionSummary obtiene datos de un endpoint API dedicado |
| Mobile nav | Desktop: nav rail. Mobile: drawer hamburguesa |
| Tests | Migrar tests de V1 para cubrir componentes V2 equivalentes |

---

## 2. Route Restructuring

### 2.1 New Route Map (without `/v2/` prefix)

| Nueva Ruta | Componente V2 | Notas |
|---|---|---|
| `/` | `V2Landing` (no auth) / `V2PlayerDashboard` (auth) | Render condicional |
| `/login` | `V2Login` | Unificado para players y admins |
| `/signup` | `V2Signup` | |
| `/forgot-password` | `V2ForgotPassword` | |
| `/dashboard` | `V2PlayerDashboard` | Player home |
| `/practica` | `V2PracticaLanding` | |
| `/especialidad/:id` | `V2EspecialidadCasos` | **NUEVO** componente |
| `/simulacro/setup` | `V2MockExamSetup` | |
| `/simulacro/resumen` | `V2SessionSummary` | Datos de API |
| `/caso/:identificador` | `V2Examen` | Multi-pregunta |
| `/perfil` | `V2Profile` | |
| `/onboarding` | `V2Onboarding` | Con API integration |
| `/contribuir` | `V2Contribuir` | Con API integration |
| `/mis-contribuciones` | `V2MisContribuciones` | |
| `/leaderboard` | `V2NationalLeaderboard` | |
| `/imagenes` | `V2ImageBank` | |
| `/flashcards/repaso` | `V2FlashcardStudy` | |
| `/flashcards/crear` | `V2FlashcardCreator` | |
| `/flashcards/generar` | `V2AIFlashcardGenerator` | |
| `/biblioteca` | `V2KnowledgeBase` | |
| `/errores` | `V2ErrorReview` | |
| `/perfil/publico/:userId` | `V2PublicProfile` | |
| `/checkout` | `V2Checkout` | |
| `/caso-estudio/:id` | `V2CaseStudy` | |
| `/mensajes` | `V2DirectMessaging` | |
| `/suscripcion` | `V2SubscriptionManagement` | |
| `/cupones` | `V2CouponCenter` | |

### 2.2 Admin Routes (V2)

| Nueva Ruta | Componente V2 | Equivalente V1 |
|---|---|---|
| `/admin` | `V2AdminDashboard` | `Dashboard` + `Summary` |
| `/admin/usuarios` | `V2AdminUsers` | `UserTable` |
| `/admin/casos` | **V2AdminCasos** (NUEVO) | `CasoTable` |
| `/admin/casos/nuevo` | **V2AdminCasoForm** (NUEVO) | `CasoContainer` |
| `/admin/casos/:id/editar` | **V2AdminCasoForm** (NUEVO) | `CasoContainer` |
| `/admin/especialidades` | **V2AdminEspecialidades** (NUEVO) | `Especialidades` |
| `/admin/especialidades/nuevo` | **V2AdminEspecialidadForm** (NUEVO) | `EspecialidadForm` |
| `/admin/examenes` | **V2AdminExamenes** (NUEVO) | `ExamenTable` |
| `/admin/examenes/nuevo` | **V2AdminExamenForm** (NUEVO) | `ExamenForm` |
| `/admin/examenes/:id/editar` | **V2AdminExamenForm** (NUEVO) | `ExamenForm` |
| `/admin/preguntas` | **V2AdminPreguntas** (NUEVO) | `QuestionTable` |
| `/admin/preguntas/nueva` | **V2AdminPreguntaDetail** (NUEVO) | `QuestionDetail (create)` |
| `/admin/preguntas/:id` | **V2AdminPreguntaDetail** (NUEVO) | `QuestionDetail (view)` |
| `/admin/preguntas/:id/editar` | **V2AdminPreguntaDetail** (NUEVO) | `QuestionDetail (edit)` |
| `/admin/flashcards` | **V2AdminFlashcards** (NUEVO) | `FlashcardTable` |
| `/admin/logros` | **V2AdminLogros** (NUEVO) | `AchievementTable` |
| `/admin/logros/nuevo` | **V2AdminLogroForm** (NUEVO) | `AchievementForm` |
| `/admin/logros/:id/editar` | **V2AdminLogroForm** (NUEVO) | `AchievementForm` |

### 2.3 Redirects (old V1 paths → new paths)

| Old Path | Redirect To |
|---|---|
| `/v2/dashboard` | `/dashboard` |
| `/v2/login` | `/login` |
| `/v2/signup` | `/signup` |
| `/v2/caso/:id` | `/caso/:id` |
| `/v2/practica` | `/practica` |
| (all `/v2/*`) | Strip `/v2` prefix |
| `/v1/*` or old V1 paths | Redirect to equivalent V2 route |

### 2.4 Auth Route Changes

- **`PlayerRoute`**: Unauthenticated users redirect to `/login` (V2Login)
- **`PrivateRoute`** (admin): Unauthenticated admins redirect to `/login` (same V2Login, backend determines role)
- **Post-login redirect**: Players → `/dashboard`, Admins → `/admin`, First-time users → `/onboarding`
- **Logout**: Clear auth, redirect to `/` (V2Landing)

---

## 3. Component Changes

### 3.1 Files to DELETE (V1 components no longer needed)

**Core V1 Layout:**
- `src/App.jsx` — V1 layout wrapper (replaced by `V2App`)
- `src/App.css` — V1 styles
- `src/components/Navi.jsx` — V1 navigation (replaced by `V2Navi`)
- `src/components/ThemeToggle.jsx` — V1 theme toggle (integrated in `V2Navi`)

**V1 Player Components:**
- `src/components/Landing.jsx` + `src/components/Landing.css`
- `src/components/PlayerLogin.jsx`
- `src/components/PlayerDashboard.jsx` + `src/components/PlayerDashboard.module.css`
- `src/components/PlayerCasoContainer.jsx`
- `src/components/Examen.jsx`
- `src/components/Onboarding.jsx` + `src/components/Onboarding.module.css`
- `src/components/Profile.jsx` + `src/components/Profile.module.css`
- `src/components/Caso.jsx`
- `src/components/Pregunta.jsx`
- `src/components/ContributionsSummary.jsx`
- `src/components/ContributionTypeSelector.jsx`
- `src/pages/Player/EspecialidadCasos.jsx`
- `src/pages/Player/MyContributions.jsx`
- `src/pages/Player/Flashcards.jsx`
- `src/pages/Player/FlashcardCreate.jsx`
- `src/components/Login.jsx` — V1 admin login

**V1 Admin Components:**
- `src/components/admin/Dashboard.jsx`
- `src/components/admin/Summary.jsx`
- `src/components/admin/CasoTable.jsx`
- `src/components/admin/CasoContainer.jsx`
- `src/components/admin/CasoForm.jsx`
- `src/components/admin/CasoRow.jsx`
- `src/components/admin/Especialidades.jsx`
- `src/components/admin/EspecialidadForm.jsx`
- `src/components/admin/EspecialidadRow.jsx`
- `src/components/admin/ExamenTable.jsx`
- `src/components/admin/ExamenRow.jsx`
- `src/components/admin/ExamenForm.jsx`
- `src/components/admin/QuestionTable.jsx`
- `src/components/admin/QuestionDetail.jsx`
- `src/components/admin/QuestionForm.jsx`
- `src/components/admin/AnswerForm.jsx`
- `src/components/admin/UserTable.jsx`
- `src/components/admin/UserRow.jsx`
- `src/components/admin/UserForm.jsx`
- `src/components/admin/FlashcardTable.jsx`
- `src/components/admin/AchievementTable.jsx`
- `src/components/admin/AchievementForm.jsx`
- `src/components/admin/RecentSummaryTable.jsx`
- `src/components/admin/SideNavAdmin.jsx`
- `src/components/admin/index.js`

**V1 Custom Components (all deleted):**
- `src/components/custom/CustomButton.jsx`
- `src/components/custom/CustomCards.jsx`
- `src/components/custom/CustomCheckbox.jsx`
- `src/components/custom/CustomCol.jsx`
- `src/components/custom/CustomCollection.jsx`
- `src/components/custom/CustomCollectionItem.jsx`
- `src/components/custom/CustomIcon.jsx`
- `src/components/custom/CustomNavbar.jsx`
- `src/components/custom/CustomPagination.jsx`
- `src/components/custom/CustomPreloader.jsx`
- `src/components/custom/CustomProgressBar.jsx`
- `src/components/custom/CustomRow.jsx`
- `src/components/custom/CustomSelect.jsx`
- `src/components/custom/CustomSideNav.jsx`
- `src/components/custom/CustomSideNavItem.jsx`
- `src/components/custom/CustomTable.jsx`
- `src/components/custom/CustomTextarea.jsx`
- `src/components/custom/CustomTextInput.jsx`
- `src/components/custom/index.js`
- `src/components/custom/ScrollToTop.jsx` + `ScrollToTop.module.css`
- `src/components/custom/AuthForm.jsx` + `AuthForm.css`

**V1 Facebook/Google login containers:**
- `src/components/facebook/FacebookLogin.jsx`
- `src/components/facebook/FacebookLoginContainer.jsx`
- `src/components/facebook/FacebookComments.jsx`
- `src/components/google/GoogleLogin.jsx`
- `src/components/google/GoogleLoginContainer.jsx`

**V1 Tests to delete/replace:**
- All test files referencing deleted V1 components

### 3.2 Files to MODIFY

- **`src/routes/AppRoutes.jsx`** — Complete rewrite: remove all V1 routes, V2 routes without `/v2/` prefix, add redirects for old paths
- **`src/routes/PrivateRoute.jsx`** — Redirect to `/login` instead of `/admin`
- **`src/components/PlayerRoute.jsx`** — Redirect to `/login` instead of `/login` (V1 PlayerLogin)
- **`src/components/Logout.jsx`** — Redirect to `/` instead of `/` (V1 Landing)
- **`src/v2/layouts/V2App.jsx`** — Update path references in nav, ensure it's the sole layout
- **`src/v2/components/V2Navi.jsx`** — Major changes:
  - Update all paths (strip `/v2/` prefix)
  - Filter nav items by user role (Auth.isAdmin() → show admin items)
  - Mobile responsive: drawer with hamburger on small screens
  - Desktop: keep nav rail
- **`src/v2/pages/V2Login.jsx`** — Add Google Login + Facebook Login buttons + handlers
- **`src/v2/pages/V2Signup.jsx`** — Add Google Login + Facebook Login buttons + handlers
- **`src/v2/pages/V2PlayerDashboard.jsx`** — Replace mock data with API calls (ExamService, UserService)
- **`src/v2/pages/V2Examen.jsx`** — Multi-question navigation, session state management, send answers to API
- **`src/v2/pages/V2SessionSummary.jsx`** — Fetch session results from API endpoint
- **`src/v2/pages/V2Contribuir.jsx`** — Add form submission to API (ExamService.createCaso or similar)
- **`src/v2/pages/V2Onboarding.jsx`** — Call `UserService.updateUser()` to save specialty/year preferences
- **`src/v2/pages/V2Profile.jsx`** — Add logout action, connect specialty changes to API
- **`src/v2/styles/v2-theme.css`** — Add MD3 component equivalents for any Custom* components still needed (Preloader, etc.)

### 3.3 Files to CREATE

**New Player Page:**
- `src/v2/pages/V2EspecialidadCasos.jsx` — List cases by specialty area (replaces V1 EspecialidadCasos)

**New Admin Pages (13 total):**
- `src/v2/pages/admin/V2AdminCasos.jsx` — CRUD table for clinical cases
- `src/v2/pages/admin/V2AdminCasoForm.jsx` — Create/edit case form
- `src/v2/pages/admin/V2AdminEspecialidades.jsx` — CRUD table for specialties
- `src/v2/pages/admin/V2AdminEspecialidadForm.jsx` — Create/edit specialty form
- `src/v2/pages/admin/V2AdminExamenes.jsx` — CRUD table for exams
- `src/v2/pages/admin/V2AdminExamenForm.jsx` — Create/edit exam form
- `src/v2/pages/admin/V2AdminPreguntas.jsx` — Table for questions
- `src/v2/pages/admin/V2AdminPreguntaDetail.jsx` — View/create/edit question with answers
- `src/v2/pages/admin/V2AdminFlashcards.jsx` — Table for flashcards
- `src/v2/pages/admin/V2AdminLogros.jsx` — Table for achievements
- `src/v2/pages/admin/V2AdminLogroForm.jsx` — Create/edit achievement form
- `src/v2/pages/admin/index.js` — Barrel export

**New V2 Common Components (replace Custom*):**
- `src/v2/components/V2Preloader.jsx` — MD3 loading indicator (replaces CustomPreloader)
- `src/v2/components/V2Table.jsx` — MD3 data table (replaces CustomTable)
- `src/v2/components/V2ConfirmDialog.jsx` — MD3 confirmation dialog for delete actions

---

## 4. Detailed Feature Specifications

### 4.1 V2Navi — Responsive Navigation with Role Filtering

**Desktop (>768px):** Nav rail (current implementation)  
**Mobile (≤768px):** Top bar with hamburger icon → drawer slides in from left

**Role-based visibility:**

| Nav Item | Path | Player | Admin |
|---|---|---|---|
| Inicio | `/dashboard` | ✅ | ✅ |
| Práctica | `/practica` | ✅ | ✅ |
| Simulacro | `/simulacro/setup` | ✅ | ✅ |
| Ranking | `/leaderboard` | ✅ | ✅ |
| Imágenes | `/imagenes` | ✅ | ✅ |
| Repaso | `/flashcards/repaso` | ✅ | ✅ |
| Biblioteca | `/biblioteca` | ✅ | ✅ |
| Errores | `/errores` | ✅ | ✅ |
| Contribuir | `/contribuir` | ✅ | ✅ |
| Mis Casos | `/mis-contribuciones` | ✅ | ✅ |
| Mensajes | `/mensajes` | ✅ | ✅ |
| Suscripción | `/suscripcion` | ✅ | ✅ |
| Cupones | `/cupones` | ✅ | ✅ |
| Admin | `/admin` | ❌ | ✅ |
| Perfil | `/perfil` | ✅ | ✅ |
| Cerrar Sesión | (action) | ✅ | ✅ |

**Implementation:** 
- Use `Auth.isAdmin()` to conditionally render Admin nav item
- CSS media query at 768px breakpoint
- Mobile: add hamburger button that toggles a `<div className="v2-nav-drawer">` overlay
- Drawer items same as rail, with close-on-click

### 4.2 V2Login / V2Signup — Social Login Integration

**V2Login additions:**
- "Continuar con Google" button (uses existing `GoogleLoginContainer` logic, adapted)
- "Continuar con Facebook" button (uses existing `FacebookLoginContainer` logic, adapted)
- Divider line with "o" between social buttons and email/password form
- Post-login: redirect admins to `/admin`, players to `/dashboard` (check `Auth.isAdmin()`)

**V2Signup additions:**
- Same social buttons as V2Login
- Social signup: if new user, redirect to `/onboarding`; if existing, redirect to `/dashboard`

**Technical approach:**
- Extract Google/Facebook login logic from V1 containers into reusable hooks or utility functions
- Use the same `UserService.googleLogin()` and Facebook SDK pattern
- Remove dependency on V1 `GoogleLoginContainer.jsx` and `FacebookLoginContainer.jsx`

### 4.3 V2Examen — Multi-Question Flow

**Current state:** Only evaluates `preguntas[0]` with a single `selectedAnswer` state.

**Target state:**
- Track answers per question: `answers = {}` (key: question index, value: selected answer index)
- Show one question at a time with navigation (Previous / Next / Confirm)
- Progress indicator showing question X of Y
- On final submit: send all answers to `ExamService.sendAnswers()` 
- Navigate to `/simulacro/resumen` with session ID
- Support `random` identifier (load random case from API)
- Timer functionality (for mock exam mode)

### 4.4 V2SessionSummary — API-Driven Results

**Current state:** All stats hardcoded.

**Target state:**
- Receive session ID via route params or location state
- Call dedicated API endpoint (e.g., `GET /v2/sessions/:id/summary`)
- Display real accuracy, XP earned, time spent, topic breakdown
- Show incorrect questions with correct answers and explanations

### 4.5 V2Onboarding — API Integration

**Current state:** Only local state, no API call on completion.

**Target state:**
- On final step ("¡Empezar ahora!"): call `UserService.updateUser(userId, { preferences: { specialty: selectedSpec, examYear: selectedYear } })`
- Show loading state during save
- On error: show alert and stay on page
- On success: navigate to `/dashboard`
- If user already has preferences, skip onboarding (redirect to `/dashboard`)

### 4.6 V2Contribuir — API Integration

**Current state:** Form with local state only, no submit handler.

**Target state:**
- On "Enviar para Revisión": call `ExamService.createCaso({ texto: form.caso, preguntas: [{ texto: form.pregunta, respuestas: form.opciones.map((op, idx) => ({ texto: op, is_correct: idx === form.correcta })) }], perla: form.perla })`
- Show loading state on submit button
- On success: show confirmation toast and redirect to `/mis-contribuciones`
- On error: show error alert
- Add validation: all fields required, at least 2 options filled

### 4.7 V2EspecialidadCasos — New Page

**Purpose:** Show list of clinical cases filtered by specialty, allowing user to pick one to practice.

**Data:** `ExamService.loadCasosByCategory(categoryId)` or equivalent API call

**UI:**
- Header with specialty name and icon
- Grid/list of case cards (identifier, description preview, difficulty)
- Click a case → navigate to `/caso/:identificador`
- "Caso Aleatorio" FAB button

### 4.8 Admin CRUD Pages — V2 Design

All admin pages follow consistent MD3 patterns:

**List Pages (Casos, Especialidades, Examenes, Preguntas, Flashcards, Logros, Usuarios):**
- Search/filter bar at top
- V2Table component with sortable columns
- FAB button for "Add new" in bottom-right
- Row actions: Edit, Delete (with V2ConfirmDialog)
- Pagination using V2 pagination component

**Form Pages (CasoForm, EspecialidadForm, ExamenForm, PreguntaDetail, LogroForm):**
- Back button to list page
- Form sections in V2 cards
- V2 input components (outlined style)
- Save/Cancel buttons at bottom
- Loading state during save

**QuestionDetail (complex):**
- Mode: view / create / edit (via route param or prop)
- Question text + answer options (add/remove dynamically)
- Mark correct answer(s)
- Support single and multiple correct answers

---

## 5. Cleanup & Technical Debt

### 5.1 Dependencies to Remove

After all V1 components are deleted, these Materialize CSS dependencies may be removable:
- `@materializecss/materialize` (CSS framework) — verify no remaining usage
- `react-materialize` — already removed per STATUS_REAL.md

### 5.2 CSS Cleanup

- Delete `src/App.css` (V1 styles)
- Delete `src/theme.css` (V1 theme variables, superseded by `v2-theme.css`)
- Delete `src/index.css` if only V1 styles remain
- Remove inline styles in V2 components gradually (convert to CSS classes in `v2-theme.css`)
- Remove `src/components/Landing.css`

### 5.3 Service Layer

- `src/services/` stays as-is (BaseService pattern works for both V1/V2)
- May need new service methods:
  - `ExamService.loadCasosByCategory(categoryId)` — for V2EspecialidadCasos
  - `ExamService.createCaso(payload)` — for V2Contribuir
  - `ExamService.getSessionSummary(sessionId)` — for V2SessionSummary
  - `UserService.getAdminStats()` — already called by V2AdminDashboard
  - `UserService.getUsers()` — already called by V2AdminUsers

### 5.4 Context/State Management

- `src/context/CasoContext.js` — evaluate if still needed or can be replaced by local state
- Consider a minimal SessionContext for exam state across V2Examen → V2SessionSummary

---

## 6. Test Migration Strategy

### 6.1 Tests to Update

| Old Test | New Test | Notes |
|---|---|---|
| `App.test.jsx` | `V2App.test.jsx` | Test V2App layout renders |
| `Navi.test.jsx` | `V2Navi.test.jsx` | Test role filtering, mobile/desktop |
| `Login.test.jsx` | `V2Login.test.jsx` | Test email + social login |
| `PlayerLogin.test.jsx` | (merged into V2Login.test) | Deleted |
| `PlayerDashboard.test.jsx` | `V2PlayerDashboard.test.jsx` | Test API integration |
| `Examen.test.jsx` | `V2Examen.test.jsx` | Test multi-question flow |
| `Caso.test.jsx` | (merged into V2Examen.test) | Deleted |
| `Profile.test.jsx` | `V2Profile.test.jsx` | Test API calls |
| `Onboarding.test.jsx` | `V2Onboarding.test.jsx` | Test API save |
| `AppRoutes.test.jsx` | `AppRoutes.test.jsx` | Update for new route structure |
| `PrivateRoute.test.jsx` | `PrivateRoute.test.jsx` | Test redirect to `/login` |

### 6.2 New Tests

- `V2EspecialidadCasos.test.jsx` — New page
- `V2AdminCasos.test.jsx` — Admin CRUD
- `V2AdminCasoForm.test.jsx` — Admin form
- (Similar for each admin CRUD page)
- `V2Contribuir.test.jsx` — Test form submission

---

## 7. Implementation Order (Suggested)

### Phase 1: Route Restructuring & Auth (Foundation)
1. Rewrite `AppRoutes.jsx` with new route structure (no `/v2/` prefix)
2. Update `PlayerRoute.jsx` redirect to `/login`
3. Update `PrivateRoute.jsx` redirect to `/login`
4. Update `Logout.jsx` redirect to `/`
5. Update `V2Navi.jsx` paths (strip `/v2/`)
6. Update all `history.push()` calls inside V2 pages (strip `/v2/`)

### Phase 2: V2Navi Responsive + Role Filtering
7. Implement mobile drawer in `V2Navi.jsx`
8. Add role-based nav item filtering
9. Add logout action to nav

### Phase 3: Social Login Integration
10. Extract Google/Facebook login logic into reusable utilities
11. Add social login buttons to `V2Login.jsx` and `V2Signup.jsx`
12. Implement post-login role-based redirect

### Phase 4: API Integration for Existing V2 Pages
13. Connect `V2PlayerDashboard.jsx` to real API (ExamService, UserService)
14. Connect `V2Onboarding.jsx` to `UserService.updateUser()`
15. Connect `V2Contribuir.jsx` to `ExamService.createCaso()`
16. Connect `V2Profile.jsx` logout and specialty changes to API
17. Implement multi-question flow in `V2Examen.jsx` with API answer submission
18. Connect `V2SessionSummary.jsx` to session API endpoint

### Phase 5: New Player Page
19. Create `V2EspecialidadCasos.jsx` with case listing by specialty

### Phase 6: Admin CRUD Migration
20. Create `V2AdminCasos.jsx` + `V2AdminCasoForm.jsx`
21. Create `V2AdminEspecialidades.jsx` + `V2AdminEspecialidadForm.jsx`
22. Create `V2AdminExamenes.jsx` + `V2AdminExamenForm.jsx`
23. Create `V2AdminPreguntas.jsx` + `V2AdminPreguntaDetail.jsx`
24. Create `V2AdminFlashcards.jsx`
25. Create `V2AdminLogros.jsx` + `V2AdminLogroForm.jsx`
26. Add admin routes to `AppRoutes.jsx`

### Phase 7: Component Cleanup
27. Create `V2Preloader.jsx` (MD3 equivalent of CustomPreloader)
28. Create `V2Table.jsx` (MD3 equivalent for admin tables)
29. Create `V2ConfirmDialog.jsx` (for admin delete confirmations)
30. Replace remaining Custom* imports in V2 pages with V2 equivalents
31. Delete all V1 component files
32. Delete V1 CSS files (App.css, theme.css, Landing.css, etc.)
33. Delete V1 custom component files
34. Delete V1 admin component files
35. Delete V1 auth components (Login.jsx, PlayerLogin.jsx)
36. Delete Facebook/Google V1 containers

### Phase 8: Test Migration
37. Update/rewrite existing tests for new route structure
38. Write new tests for V2 components with API integration
39. Write tests for admin CRUD pages
40. Remove deleted V1 component tests

### Phase 9: Final Cleanup
41. Evaluate and remove unused npm dependencies (Materialize CSS)
42. Remove unused CSS/imports
43. Verify all routes work with `npm start`
44. Run full test suite with `npm test`
45. Run build with `npm run build`

---

## 8. Edge Cases & Considerations

- **Bookmarked URLs:** Users with `/v2/...` or old V1 URLs bookmarked need redirects
- **Admin detection:** After login, check `Auth.isAdmin()` to redirect appropriately; if user is both player and admin, default to player dashboard with admin nav visible
- **Onboarding skip:** If user already has preferences saved, skip onboarding page
- **Session persistence:** If user refreshes mid-exam, they should resume (consider session storage or API recovery)
- **Mobile drawer:** Close drawer on navigation (clicking a nav item)
- **Dark mode:** V2Navi theme toggle must work consistently across all pages
- **Facebook SDK deprecation:** Facebook Login SDK may need update; check if still supported
- **Backwards compatibility:** The backend API endpoints remain the same; only the frontend changes

---

## 9. Files Summary

**~60 files to DELETE** (V1 components, CSS, admin V1, custom V1)  
**~16 files to CREATE** (1 player page, 11 admin pages, 3 V2 common components, 1 barrel export)  
**~12 files to MODIFY** (routes, auth, existing V2 pages)  
**~40 tests to UPDATE/CREATE**
