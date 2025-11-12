# Plan de Desarrollo

## Estatus del Proyecto

El proyecto es una aplicación web basada en React diseñada para la preparación del examen ENARM. Se identificaron múltiples vulnerabilidades de seguridad en las dependencias del proyecto a través de `npm audit`.

La mayoría de las vulnerabilidades se han resuelto actualizando los paquetes a versiones más seguras. Sin embargo, algunas vulnerabilidades persisten debido a que son dependencias transitivas dentro de `react-scripts` y no pueden resolverse sin una nueva versión de ese paquete.

## Próximos Pasos

1.  **Monitoreo de `react-scripts`**: Vigilar las nuevas versiones de `react-scripts` para incorporar futuras correcciones de seguridad.
2.  **Actualizar las dependencias**: Revisar y actualizar todas las dependencias del proyecto a sus últimas versiones estables para mejorar la seguridad y la compatibilidad.
3.  **Ejecutar las pruebas**: Correr el conjunto de pruebas existente para asegurar que la funcionalidad principal no se haya visto afectada por los cambios recientes.

## Mejoras

1.  **Gestión de estado**: Implementar una solución de gestión de estado más robusta como Redux o React Context para manejar el estado de la aplicación de manera más eficiente.
2.  **Prueas de extremo a extremo**: Añadir pruebas de extremo a extremo (end-to-end) con herramientas como Cypress o Playwright para automatizar la verificación de los flujos de usuario.
3.  **CI/CD**: Mejorar el pipeline de CI/CD para incluir pasos de pruebas automatizadas y despliegues para agilizar el proceso de desarrollo.
