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
