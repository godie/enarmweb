# Project Instructions

## Package Manager
- **Use npm exclusively** for dependency management and scripts (`npm start`, `npm test`, `npm lint`, `npm run build`).
- Do NOT use pnpm or yarn.
- Always use `--legacy-peer-deps` when running `npm install` or `npm ci` if needed, as per current project standards.

## GitHub Actions
- The CI/CD pipeline is configured to use `npm`.
- Ensure `package-lock.json` is always updated and committed when changing dependencies.
