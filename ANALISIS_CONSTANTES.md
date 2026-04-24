# Análisis de Constantes y Duplicaciones en GitHub Actions

## 📋 Constantes que deberían estar en .env

### ✅ Ya configuradas en deploy.yml (pero no usadas en código)
1. **VITE_GOOGLE_CLIENT_ID** - Configurada en `deploy.yml` pero hardcodeada en:
   - `src/components/google/GoogleLoginContainer.jsx` (línea 53): `32979180819-lob8rj66qsjukuq9dnjgqckv04nv5tof.apps.googleusercontent.com`

2. **VITE_API_BASE_URL** - Configurada en `deploy.yml` pero hardcodeada en:
   - `src/services/BaseService.js` (líneas 7-11):
     - `http://localhost:3000` (desarrollo)
     - `https://enarmapi.godieboy.com` (producción)

### ❌ No configuradas en ningún lugar
3. **VITE_FACEBOOK_APP_ID** - Hardcodeada en:
   - `src/components/facebook/FacebookLoginContainer.jsx` (línea 60): `401225480247747`
   - `src/components/Examen.jsx` (línea 49): `401225480247747`

4. **VITE_GOOGLE_ANALYTICS_ID** - Hardcodeada en:
   - `src/components/AnalyticsTracker.js` (línea 6): `UA-2989088-15`

5. **VITE_APP_BASE_URL** - Hardcodeada en:
   - `src/components/Examen.jsx` (línea 13): `http://enarm.godieboy.com`

### ⚠️ Opcionales (solo desarrollo local)
6. **Rutas de certificados SSL** - Hardcodeadas en:
   - `vite.config.js` (líneas 13-14):
     - `/Users/diegomendozasalas/repos/enarmapi/localhost+2-key.pem`
     - `/Users/diegomendozasalas/repos/enarmapi/localhost+2.pem`
   - Estas son específicas del entorno local y podrían mantenerse en el código o moverse a .env

---

## 🔄 Duplicaciones en GitHub Actions

### Duplicaciones encontradas entre `node.js.yml` y `deploy.yml`:

#### 1. **Configuración de Node.js** (DUPLICADO)
- Ambos usan `actions/setup-node@v4`
- Ambos usan `node-version: '22'` (uno como string, otro como `22.x` en matrix)
- Ambos usan `cache: 'npm'`

#### 2. **Instalación de dependencias** (DUPLICADO con diferencia)
- `node.js.yml`: `npm ci --legacy-peer-deps`
- `deploy.yml`: `npm ci`
- **⚠️ DIFERENCIA IMPORTANTE**: Uno usa `--legacy-peer-deps` y el otro no. Esto puede causar inconsistencias.

#### 3. **Checkout** (DUPLICADO)
- Ambos usan `actions/checkout@v4`

#### 4. **Trigger en push a master** (DUPLICADO)
- Ambos se ejecutan en `push: branches: [master]`
- Esto significa que ambos workflows se ejecutan simultáneamente en cada push a master

---

## 💡 Recomendaciones

### Para las constantes:
1. Crear archivo `.env.example` con todas las variables necesarias
2. Actualizar el código para usar `import.meta.env.VITE_*` en lugar de valores hardcodeados
3. Agregar `VITE_FACEBOOK_APP_ID` y `VITE_GOOGLE_ANALYTICS_ID` al workflow de deploy

### Para los workflows:
1. **Unificar la instalación de dependencias**: Decidir si usar `--legacy-peer-deps` o no, y aplicarlo consistentemente
2. **Considerar combinar workflows**: El workflow `node.js.yml` solo hace tests, mientras que `deploy.yml` hace build y deploy. Podrías:
   - Hacer que `deploy.yml` dependa de `node.js.yml` (ejecutar tests antes de deploy)
   - O combinar ambos en un solo workflow con jobs separados
3. **Evitar duplicación de setup**: Considerar usar un workflow reutilizable o un job compartido

---

## 📝 Archivos a modificar

1. `src/services/BaseService.js` - Usar `VITE_API_BASE_URL`
2. `src/components/google/GoogleLoginContainer.jsx` - Usar `VITE_GOOGLE_CLIENT_ID`
3. `src/components/facebook/FacebookLoginContainer.jsx` - Usar `VITE_FACEBOOK_APP_ID`
4. `src/components/Examen.jsx` - Usar `VITE_FACEBOOK_APP_ID` y `VITE_APP_BASE_URL`
5. `src/components/AnalyticsTracker.js` - Usar `VITE_GOOGLE_ANALYTICS_ID`
6. `.github/workflows/deploy.yml` - Agregar `VITE_FACEBOOK_APP_ID` y `VITE_GOOGLE_ANALYTICS_ID`
7. `.github/workflows/node.js.yml` - Revisar consistencia con `deploy.yml`
