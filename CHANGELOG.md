# Registro de cambios por rama y fecha

Llevar aquí cambios relevantes (restauraciones, merges, refactors) con **rama**, **fecha** y **descripción** para no perder contexto y evitar repetir errores (p. ej. archivos borrados en un merge).

---

## 2025-03-04 — Rama: `fix/restore-mejoras`

**Origen:** Rama creada desde `master` tras un merge que borró archivos que ya estaban en master (desde `feature/mejoras-en-general`).

### Restauración de archivos

- Archivos restaurados desde `feature/mejoras-en-general`:
  - `plan-user-friendly.md`
  - Admin: `AchievementForm.jsx`, `AchievementTable.jsx`, `FlashcardTable.jsx`, `QuestionDetail.jsx`, `QuestionTable.jsx`, `UserForm.jsx`
  - Player: `FlashcardCreate.jsx`, `Flashcards.jsx`, `Flashcards.test.jsx`
  - Servicios: `AIService.js`, `AchievementService.js`, `FlashcardService.js`, `FlashcardService.test.js`, `LeaderboardService.js`, `MessageService.js`, `SpecialistService.js`, `UserExamService.js`, `UserFlashcardDraftService.js`
- Se mantuvieron las rutas y componentes ya renombrados en la rama (Login, Logout, Navi, PlayerRoute, PlayerLogin, ThemeToggle en `src/components/` sin subcarpetas auth/layout/guards).

### Rutas y navegación

- En `AppRoutes.jsx` se añadieron imports y rutas para: UserForm, QuestionTable, QuestionDetail, FlashcardTable, AchievementTable, AchievementForm, Flashcards, FlashcardCreate.
- Rutas player: `/flashcards`, `/flashcards/nueva`.
- Rutas admin: `/dashboard/players/new`, `/dashboard/questions` (y new, :id, :id/edit), `/dashboard/flashcards` (y new), `/dashboard/logros` (y new, edit/:id).
- SideNavAdmin: enlaces a Flashcards y Logros.
- Navi: enlace "Flashcards" para jugadores.

### URLs sin almohadilla (#)

- Sustituido `HashRouter` por `BrowserRouter` en `src/index.jsx`.
- Añadida prop `to` en `CustomSideNavItem` y `CustomButton` para navegación con `<Link>` (sin recarga ni `#`).
- Todos los `href="#/..."` sustituidos por `to="/..."` en: SideNavAdmin, AppRoutes, Landing, FlashcardTable, AchievementTable, QuestionTable.

### Lint y tests

- Ajustes de lint en archivos v2 (React no usado) y en `QuestionDetail.jsx` (dependencia de `useEffect`).

### Documentación

- En `plan-user-friendly.md`: sección "Mejoras técnicas / Futuro" con nota sobre BrowserRouter, SPA fallback en producción y alternativas (TanStack Router, React Router v6).
- Creado este `CHANGELOG.md` para registrar rama, fecha y cambios.

---

*Próximos cambios: añadir aquí una nueva entrada con fecha, rama y descripción breve.*

---

## 2024-05-22 — Rama: `feature/enarmv2-pages-expansion`

**Descripción:** Mapeo de pantallas de Stitch e implementación de 5 nuevas páginas para el ecosistema V2.

### Nuevas Páginas (V2)

- **V2NationalLeaderboard**: Ranking nacional de médicos con filtros por periodo (Semanal, Mensual, Histórico).
- **V2ImageBank**: Galería de recursos visuales médicos con búsqueda y filtrado por categorías.
- **V2FlashcardStudy**: Interfaz de repaso de flashcards con lógica de Spaced Repetition (SRS) y controles de calidad de respuesta.
- **V2KnowledgeBase**: Centro de documentación con acceso a GPCs, esquemas de vacunación y algoritmos diagnósticos.
- **V2ErrorReview**: Panel de análisis de debilidades con estadísticas por especialidad y revisión detallada de preguntas falladas.

### Infraestructura y Documentación

- **AppRoutes.jsx**: Integración de las 5 nuevas rutas bajo el prefijo `/v2/`.
- **planv2.md**: Actualización del plan de implementación con el mapeo completo de pantallas de Stitch.
- **backend_tasks.md**: Definición de contratos (endpoints, payloads y respuestas) para las nuevas funcionalidades.
- **Tests**: Unit tests creados para las 5 nuevas páginas utilizando Vitest y React Testing Library.

---

## 2025-03-13 — Rama: `feature/enarmv2-extended-player`

**Descripción:** Expansión del ecosistema V2 para el jugador con nuevas funcionalidades de estudio, comunidad y gestión.

### Nuevas Páginas (V2)

- **V2CaseStudy**: Interfaz interactiva para revisar casos clínicos resueltos, con explicaciones detalladas y análisis de aciertos.
- **V2DirectMessaging**: Centro de mensajes para comunicación directa con soporte técnico y asesoría médica.
- **V2SubscriptionManagement**: Panel de control para suscripciones premium, permitiendo ver historial de facturas, actualizar métodos de pago y gestionar cancelaciones.

### Mejoras e Integraciones

- **V2PublicProfile**: Refactorizado para consumir datos reales desde el backend a través de `UserService.getPublicProfile`.
- **V2Checkout**: Implementada la lógica de redirección a Stripe mediante `PaymentService.createCheckoutSession`.
- **Navegación**: Actualización de `V2Navi.jsx` incluyendo accesos directos a todas las nuevas secciones y mejoras de accesibilidad (ARIA labels).
- **Servicios**: Creación de `PaymentService.js` y expansión de `UserService.js`.

### Pruebas y Calidad

- Unit tests con Vitest para todas las nuevas páginas y servicios, cumpliendo con el estándar de cobertura del 80%.
- Verificación visual completa mediante Playwright en entorno local.

## [0.9.5] - 2025-03-06
### Added
- New V2 Player screens: V2CouponCenter, V2FlashcardCreator, V2AIFlashcardGenerator.
- New V2 Admin base screens: V2AdminDashboard, V2AdminUsers.
- Full unit test suite for new components (Vitest + RTL) with >80% coverage.
- Integrated new routes in AppRoutes.jsx and navigation items in V2Navi.jsx.

### Fixed
- Improved accessibility in V2 screens by associating form labels with controls (htmlFor).
- Optimized performance in V2PublicProfile and V2CaseStudy by refactoring multiple setState calls into useReducer.
- Standardized loading indicators across new V2 pages.

### Updated
- planv2.md: Updated implementation status and mapped new Stitch screens.
- backend_tasks.md: Categorized endpoints into Completed and Pending (Expansion).
