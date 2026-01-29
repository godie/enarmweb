import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
    {
        // Reemplaza ignorePatterns
        ignores: ['dist', '.eslintrc.cjs', 'vite.config.js'],
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node, // Útil si tienes archivos de config en node
                M: 'readonly',
                google: 'readonly',
                FB: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // Reglas recomendadas de JS y React
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,

            // Tus reglas personalizadas
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off', // Opcional, si no usas prop-types
        },
    },
    prettier, // Siempre al final para desactivar reglas que choquen
];