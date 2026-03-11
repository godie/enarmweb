# Tareas Backend para ENARM V2

Este archivo detalla los endpoints, payloads y respuestas esperadas necesarios para soportar las nuevas funcionalidades de la versión 2.

## 1. National Leaderboard (V2NationalLeaderboard)

**Endpoint:** `GET /v2/leaderboard/national`

**Payload:** Ninguno (opcional: `period=weekly|monthly|all`)

**Respuesta Esperada:**
```json
{
  "currentUser": {
    "rank": 42,
    "points": 1250,
    "avatar": "url",
    "nickname": "DoctorX"
  },
  "topPlayers": [
    { "rank": 1, "nickname": "Dr. House", "points": 5000, "avatar": "url" },
    { "rank": 2, "nickname": "Grey", "points": 4800, "avatar": "url" }
    // ... hasta 100
  ]
}
```

---

## 2. Image Bank (V2ImageBank)

**Endpoint:** `GET /v2/images/bank`

**Payload:** Query params: `category`, `search`, `page`

**Respuesta Esperada:**
```json
{
  "images": [
    {
      "id": "img1",
      "url": "url",
      "title": "Radiografía de Tórax - Neumonía",
      "category": "Radiología",
      "tags": ["tórax", "infección"]
    }
  ],
  "pagination": { "current": 1, "total": 10 }
}
```

---

## 3. Flashcard Study (V2FlashcardStudy)

**Endpoint:** `GET /v2/flashcards/review`

**Payload:** Ninguno (el backend decide qué cartas tocan según SRS)

**Respuesta Esperada:**
```json
{
  "flashcards": [
    {
      "id": "fc1",
      "front": "¿Cuál es el tratamiento de elección para...?",
      "back": "Respuesta detallada...",
      "category": "Pediatría"
    }
  ]
}
```

**Endpoint:** `POST /v2/flashcards/review/:id/answer`

**Payload:**
```json
{
  "quality": 1 | 2 | 3 | 4 | 5  // 1: No lo sé, 5: Muy fácil
}
```

---

## 4. Knowledge Base (V2KnowledgeBase)

**Endpoint:** `GET /v2/knowledge-base`

**Payload:** Query params: `topic`, `search`

**Respuesta Esperada:**
```json
{
  "topics": [
    {
      "id": "t1",
      "title": "Guías de Práctica Clínica",
      "articles": [
        { "id": "a1", "title": "GPC Diabetes Mellitus 2024" }
      ]
    }
  ]
}
```

---

## 5. Error Review (V2ErrorReview)

**Endpoint:** `GET /v2/errors/summary`

**Payload:** Ninguno

**Respuesta Esperada:**
```json
{
  "mostFailedSpecialties": [
    { "id": "esp1", "name": "Ginecología", "count": 15 }
  ],
  "recentFailedQuestions": [
    {
      "id": "q1",
      "question": "Enunciado de la pregunta...",
      "correctAnswer": "A",
      "userAnswer": "B",
      "explanation": "Explicación detallada de por qué es A..."
    }
  ]
}
```

---

## 6. Public Profile (V2PublicProfile)

**Endpoint:** `GET /v2/users/:id/public-profile`

**Payload:** Ninguno

**Respuesta Esperada:**
```json
{
  "user": {
    "nickname": "Dr. Smith",
    "specialty": "Cardiología",
    "avatar": "url",
    "stats": {
      "totalPoints": 15000,
      "rank": 5,
      "accuracy": 85
    },
    "recentActivity": [
      { "type": "exam", "title": "Simulacro Cardiología", "score": 90, "date": "2024-05-20" }
    ],
    "achievements": [
      { "id": "ach1", "title": "Estudiante Estrella", "icon": "star" }
    ]
  }
}
```

---

## 7. Checkout (V2Checkout)

**Endpoint:** `POST /v2/payments/create-checkout-session`

**Payload:**
```json
{
  "planId": "premium_monthly",
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Respuesta Esperada:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```
