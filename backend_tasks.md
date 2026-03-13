# Tareas Backend para ENARM V2

Este archivo detalla los endpoints, payloads y respuestas esperadas necesarios para soportar las nuevas funcionalidades de la versión 2.

## COMPLETADOS (Marzo 2025)

### 1. National Leaderboard (`GET /v2/leaderboard/national`)
Soporta el ranking global de usuarios.

### 2. Image Bank (`GET /v2/images/bank`)
Galería de imágenes médicas con filtrado.

### 3. Flashcard Study (`GET /v2/flashcards/review` & `POST /v2/flashcards/review/:id/answer`)
Motor de repaso SRS.

### 4. Knowledge Base (`GET /v2/knowledge-base`)
Base de datos de temas y artículos.

### 5. Error Review (`GET /v2/errors/summary`)
Resumen de errores y especialidades más falladas.

### 6. Public Profile (`GET /v2/users/:id/public-profile`)
Perfil público con estadísticas y logros.

### 7. Checkout (`POST /v2/payments/create-checkout-session`)
Integración con Stripe.

### 8. Admin Endpoints (Base)
Endpoints para listado de usuarios, logs y configuraciones globales (Ya existentes en el backend).

## PENDIENTES / NUEVOS (Marzo 2025 Expansion)

### 1. Coupon Center
**Endpoint:** `GET /v2/coupons/me`
**Respuesta:** Lista de cupones activos y usados del usuario.

### 2. Flashcard Creation
**Endpoint:** `POST /v2/flashcards`
**Payload:** `{ front, back, specialtyId, tags }`

### 3. AI Flashcard Generator
**Endpoint:** `POST /v2/ai/generate-flashcards`
**Payload:** `{ topic, count, difficulty }`
**Respuesta:** Array de sugerencias de flashcards para revisar y guardar.
