# Plan: Core User-Friendly para Estudiantes

## Objetivo

Simplificar el flujo principal de la app de estudiantes para que un usuario pueda:

1. Entrar y entender inmediatamente qué hacer.
2. Responder preguntas sin fricción.
3. Recibir feedback claro y accionable.
4. Continuar practicando con un solo clic.

## Métricas de éxito

- Reducir tiempo de "login -> primera respuesta enviada".
- Aumentar preguntas contestadas por sesión.
- Disminuir abandono en onboarding y en flujo de preguntas.
- Mejorar tasa de retorno en 24h (vía flashcards y continuidad).

## Alcance funcional (Frontend)

### Fase 1 - Flujo principal claro

- **Dashboard estudiante simplificado**
  - CTA principal fijo: `Continuar práctica`.
  - CTA secundario: `Practicar por especialidad`.
  - Mostrar progreso corto del día (ej. respondidas hoy, precisión).

- **Navegación enfocada**
  - Reducir opciones visibles para estudiante durante práctica.
  - Mantener navegación contextual (volver, siguiente, repasar).

- **Onboarding más directo**
  - 3 pasos máximo con copy claro.
  - Persistir estado para no repetir pasos completados.

### Fase 2 - Experiencia de respuesta "sin fricción"

- **Pantalla de preguntas**
  - Progreso visible (`x de y` + barra).
  - Botón primario sticky: `Siguiente pregunta`.
  - Atajos de teclado (1-4 para opciones, Enter para continuar).
  - Estado de loading consistente entre pregunta y submit.

- **Feedback inmediato**
  - Correcta/incorrecta con diseño muy claro.
  - Explicación breve + opción para ver detalle.
  - Sugerencia de acción: `Crear flashcard` / `Ver tema relacionado`.

### Fase 3 - Continuidad e inteligencia inicial

- **Recomendación simple post-respuesta**
  - Si falla varias del mismo tema, sugerir práctica por especialidad.
  - Si acierta varias seguidas, subir dificultad o mezclar casos.

- **Flashcards integradas al ciclo**
  - CTA contextual al finalizar un bloque: `Repasar flashcards vencidas`.
  - Etiquetas de origen (manual, sugerida por error, sugerida por IA).

## Cambios requeridos de Backend (recomendados)

> La mayoría del UX se puede empezar solo en frontend, pero para una experiencia robusta convienen estos endpoints/ajustes.

### 1) Endpoint de siguiente pregunta recomendado

- `GET /practice/next_question`
- Entrada:
  - `category_id` opcional
  - `mode` (`mixed`, `weak_topics`, `new_only`)
- Salida:
  - pregunta + respuestas
  - metadatos (`reason`, `difficulty`, `topic`)

### 2) Resumen de progreso del usuario

- `GET /users/me/progress_summary`
- Salida:
  - respondidas hoy
  - precisión hoy / 7 días
  - racha actual
  - temas débiles (top 3)

### 3) Sugerencias de estudio

- `GET /users/me/recommendations`
- Salida:
  - próxima mejor acción (`continue_practice`, `review_flashcards`, `focus_specialty`)
  - lista de recomendaciones con prioridad

### 4) Flashcards del usuario (persistencia real)

- `POST /flashcards` para crear flashcards personalizadas.
- `GET /flashcards?scope=mine|system|all` para separar catálogo global vs usuario.
- `PATCH /flashcards/:id` y `DELETE /flashcards/:id` para mantenimiento.

### 5) Telemetría mínima de UX (opcional, útil)

- `POST /events/ui` para eventos:
  - `practice_started`
  - `answer_submitted`
  - `feedback_opened`
  - `flashcard_created_from_error`

## Diseño de implementación

### Frontend (enarmweb)

- Componentes clave:
  - `PlayerDashboard`
  - `Caso`
  - `Examen`
  - `Flashcards`
  - `Navi`
- Servicios:
  - `ExamService`
  - `FlashcardService`
  - nuevo `PracticeService` (cuando exista backend recomendado)

### Backend (enarmapi)

- Controladores candidatos:
  - `UsersController` (resumen/progreso)
  - nuevo `PracticeController` (siguiente pregunta/recomendaciones)
  - `FlashcardsController` (CRUD usuario)

## Riesgos y mitigaciones

- **Riesgo:** más complejidad de estado en frontend.
  - **Mitigación:** separar hooks por dominio (`usePracticeFlow`, `useProgressSummary`).

- **Riesgo:** cambios de API rompan clientes actuales.
  - **Mitigación:** agregar endpoints nuevos sin romper existentes.

- **Riesgo:** sugerencias "inteligentes" pobres al inicio.
  - **Mitigación:** empezar con heurísticas simples + medición.

## Plan incremental sugerido

1. **Sprint A (rápido):** CTA único + progreso + UX de respuesta mejorada.
2. **Sprint B:** recomendaciones simples + integración de flashcards contextual.
3. **Sprint C:** endpoints inteligentes (`next_question`, recomendaciones) + refinamiento por métricas.

## Entregables

- Frontend UX mejorada para práctica diaria.
- API extendida para progresión inteligente.
- Métricas básicas de comportamiento para iterar producto.
