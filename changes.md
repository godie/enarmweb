# Cambios en la Rama: Restauración de Componentes Admin y Servicios

Este documento resume los componentes y servicios que fueron restaurados en la rama principal tras haber sido eliminados accidentalmente en un merge previo.

## Componentes de Administración Restaurados
Se han vuelto a agregar las siguientes interfaces en `src/components/admin/`:
- **AchievementForm.jsx / AchievementTable.jsx**: Gestión de logros y recompensas.
- **AnswerForm.jsx**: Editor de respuestas para preguntas.
- **FlashcardTable.jsx**: Gestión de tarjetas de estudio.
- **QuestionTable.jsx / QuestionDetail.jsx / QuestionForm.jsx**: Sistema completo de gestión de preguntas.
- **UserTable.jsx / UserForm.jsx / UserRow.jsx**: Gestión de usuarios y roles.
- **ExamenForm.jsx / ExamenTable.jsx**: Gestión de simulacros de examen.

## Servicios Restaurados
Se han restaurado los siguientes servicios en `src/services/` para soportar las nuevas funcionalidades:
- **AIService.js**: Integración con servicios de IA.
- **AchievementService.js**: Lógica de negocio para logros.
- **FlashcardService.js**: Gestión de flashcards.
- **LeaderboardService.js**: Sistema de clasificación de usuarios.
- **MessageService.js**: Sistema de mensajería interna.
- **SpecialistService.js**: Servicios relacionados con especialistas médicos.
- **UserExamService.js**: Seguimiento de exámenes por usuario.
- **UserFlashcardDraftService.js**: Borradores de flashcards creados por usuarios.

## Mejoras de UX y UI (Palette)
- **Onboarding**: Se añadieron botones de selección masiva ("Seleccionar todas", "Deseleccionar todas") para mejorar la experiencia inicial del usuario.
- **Flashcards**: Se integró el acceso a Flashcards desde el Dashboard del jugador.
- **Navegación**: Se unificaron las rutas de administración y se mejoró la consistencia del menú superior.

## Integración con ENARM v2
- Se han mantenido y coexistido todas las nuevas rutas y componentes de la versión 2 (`/v2/*`) junto con las herramientas de administración restauradas.
