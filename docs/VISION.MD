# Documento de Visión: Enarmweb 20261.
## 1. Declaración de Misión
Enarmweb es una plataforma democrática de preparación para el ENARM que combina contenido médico de alta fidelidad (casos reales y supervisados) con un marketplace de asesoría especializada, ofreciendo una experiencia de usuario moderna y gamificada a un costo disruptivo ($100 MXN/mes).

## 2. Pilares Estratégicos (El Valor)
* **Accesibilidad Total**: Romper la barrera de los cursos caros.
* **Contenido de "Campo"**: Casos basados en la experiencia real de médicos y material de cursos de élite, filtrados por especialistas.
* **Feedback Inmediato**: Aprendizaje por corrección al instante, reforzando la memoria a corto plazo.
* **Human-in-the-loop AI**: Uso de IA para generar volumen de contenido, pero validado por humanos para asegurar rigor médico.

## 3. Definición del Producto (Alcance)
* A. Experiencia de Usuario (UX/UI)
  * **Web-First Responsiva**: Prioridad a la navegación web fluida (React + Tailwind) que se sienta como una App nativa en el celular.
  * Modo Práctica: Lectura de caso $\rightarrow$ Respuesta $\rightarrow$ Feedback GPC instantáneo.
  * Modo Simulacro: Exámenes por tiempo con resultados al finalizar (simulación de estrés real).
* B. Funcionalidades Core
  * Marketplace de Asesoría: Sistema donde médicos especialistas listan su perfil y tarifa para mentorías uno-a-uno (integración futura).
  * Dashboard de Especialidades: Progreso segmentado (Ginecología, Pediatría, Medicina Interna, Cirugía).
  * Sistema de Gamificación: Logros y medallas (Backend listo en Rails, falta integración en React) para incentivar la retención.
* C. Stack Tecnológico
  * Frontend: React (UI interactiva) + Tailwind CSS (Diseño ágil y moderno).
  * Backend: Ruby on Rails (API robusta y rápida de escalar).
  * Base de Datos: MySQL.
  * Auth: Social Login (Google/Facebook).


## 4. Hoja de Ruta (Roadmap de Visión)
* Fase 1: El Lanzamiento (MVP)
* Finalizar integración de Social Login.
  *  Prioridad: Diseñar la pantalla de "Caso Clínico" (Layout que definimos: Caso arriba / Preguntas abajo con scroll pegajoso).
  * Lanzamiento del modelo de suscripción ($100 MXN).
* Fase 2: Gamificación e Interacción
  *Conectar los logros del backend de Rails con el Dashboard de React.
  * Implementar el perfil de usuario (Profile) con estadísticas de debilidades/fortalezas.Fase 3: El Marketplace y EscalabilidadMódulo de "Especialistas": Búsqueda y contacto para asesorías.Optimización de la IA para generación de casos base.
