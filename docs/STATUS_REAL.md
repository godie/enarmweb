# Status Real del Proyecto - ENARM Prep

**Fecha:** 2026-02-12
**Lead Frontend Developer:** Jules

Este documento detalla el estado técnico actual del frontend del simulador ENARM.

---

## 1. Estructura de Rutas
La aplicación utiliza `react-router-dom` (v5) con un `Switch` principal en `AppRoutes.jsx`.

| Ruta | Componente | Estado | Tipo de Contenido |
| :--- | :--- | :--- | :--- |
| `/` | `Landing` / `PlayerDashboard` | Terminado | Real (Dinámico si autenticado) |
| `/login` | `PlayerLogin` | Terminado | Real |
| `/admin` | `Login` (Admin) | Terminado | Real |
| `/onboarding` | `Onboarding` | Terminado | Real (Selección de especialidades) |
| `/profile` | `Profile` | Terminado | Real (Perfil + Logros) |
| `/caso/:id` | `Examen` -> `Caso` | Terminado | Real (Motor de preguntas) |
| `/contribuir` | `PlayerCasoContainer` | Terminado | Real (Formulario de contribución) |
| `/dashboard` | `Summary` (Admin) | Terminado | Real (Estadísticas generales) |
| `/dashboard/casos/:page` | `CasoTable` | Terminado | Real (Listado CRUD) |
| `/dashboard/edit/caso/:id` | `CasoContainer` | Terminado | Real (Formulario edición) |
| `/dashboard/especialidades` | `Especialidades` | Terminado | Real (Listado CRUD) |
| `/dashboard/players` | `UserTable` | Terminado | Real (Gestión usuarios) |
| `/dashboard/examenes` | `ExamenTable` | Terminado | Real (Gestión simulacros) |

### ⚠️ Hallazgos en Rutas:
- **Ruta Faltante:** `PlayerDashboard.jsx` intenta navegar a `/especialidad/:id`, pero esta ruta **no existe** en `AppRoutes.jsx`.
- **Navegación `/caso/random`:** Existe lógica para navegar a un caso aleatorio, pero depende de que el componente `Caso` maneje el string "random".

---

## 2. Estado de Componentes

### Componentes de Sistema (`src/components/custom/`)
Se ha implementado una capa de abstracción sobre Materialize para asegurar consistencia:
- **`CustomButton`**: Terminado. Soporta estados de carga (`isPending`) y accesibilidad mejorada.
- **`CustomTextInput` / `CustomTextarea`**: Terminados. Integrados con iconos de Materialize.
- **`CustomPreloader`**: Terminado. Centraliza la visualización de carga.
- **`StatCard` / `CustomCard`**: Terminados. Usados en dashboards.

### Componentes de Negocio
- **`PlayerDashboard`**: Funcional, pero contiene **Mocks** (datos hardcodeados) para el contador de casos, precisión y racha.
- **`Caso` / `Pregunta`**: Terminados. Soportan selección única y múltiple con validación de respuestas.
- **`Onboarding`**: Terminado. Persiste preferencias en la API y `localStorage`.
- **`Profile`**: Terminado. Integra visualización de logros reales de la API.

---

## 3. Integración con API
Los servicios están centralizados en `src/services/` extendiendo de `BaseService`.

- **`Auth` (Módulo):** Gestiona `token` y `userInfo` en `localStorage`. Soporta roles (admin/player).
- **`UserService`:**
  - `login` / `googleLogin` / `createUser`: Implementados.
  - `getAchievements(userId)`: Implementado y usado en `Profile`.
  - `updateUser`: Usado en `Onboarding` para guardar preferencias.
- **`ExamService`:**
  - CRUD de Exámenes y Casos: Implementado para Admin.
  - `getQuestions` / `sendAnswers`: Implementado para el motor de exámenes.
  - `loadCategories`: Usado para filtrar por especialidad.

---

## 4. Estado de la UI
- **Framework Principal:** Materialize CSS (@materializecss/materialize).
- **Consistencia:** Alta. Se nota un esfuerzo por migrar de `react-materialize` (eliminado) a componentes `Custom` propios.
- **Mezcla de Estilos:**
  - **No se detecta Tailwind CSS.**
  - **Uso de CSS Moderno:** Se utiliza `theme.css` para variables de color (modo oscuro soportado parcialmente).
  - **Deuda Visual:** Persisten estilos inline en varios componentes (`PlayerDashboard`, `Profile`, `Caso`) que deberían moverse a clases CSS o variables del tema.

---

## 5. Pendientes Críticos y Deuda Técnica

### 🔴 Críticos
1. **Ruta Especialidades:** Implementar la vista y ruta para `/especialidad/:id` para que el dashboard sea navegable.
2. **Dashboard Stats:** Reemplazar los mocks de `completedCases`, `accuracy` y `streak` por llamadas reales a un endpoint de estadísticas.

### 🟡 TODOs y Código Comentado
- **`AppRoutes.jsx`:** Comentarios de limpieza tras eliminar `react-materialize`.
- **`ExamService.js`:** Lógica de nombrado de casos comentada (`//caso['name'] = ...`).
- **`Caso.jsx`:** Import de `FacebookProvider` comentado; se usa un componente `FacebookComments` legacy en `Examen.jsx`.
- **`RecentSummaryTable.jsx`:** Texto "VER TODO(A)S" hardcodeado (potencial issue de internacionalización).

### 🔵 Mejoras Sugeridas
- Eliminar dependencias de `window.innerWidth` en `Examen.jsx` y usar Media Queries.
- Estandarizar el manejo de errores de API en un interceptor de Axios (actualmente se maneja por componente).
