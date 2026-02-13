# Mejoras Pendientes

- **Refactorización de Contexto en CasoContainer:**
  Implementar `useContext` (crear un `CasoContext`) en `CasoContainer` para pasar funciones de manipulación de estado (`onChangeAnswer`, `deleteAnswer`, `addAnswer`, `deleteQuestion`, etc.) directamente a los componentes hijos (`QuestionForm`, `AnswerForm`). Esto eliminará el "prop drilling" excesivo y limpiará la firma de props de los componentes intermedios como `CasoForm`.
