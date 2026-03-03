import { useState } from 'react';
import Auth from '../modules/Auth';
import UserService from '../services/UserService';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return document.documentElement.getAttribute('theme') || localStorage.getItem('theme') || 'light';
    });

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';

        // 1. Update DOM
        document.documentElement.setAttribute('theme', newTheme);
        setTheme(newTheme);

        // 2. Save locally
        localStorage.setItem('theme', newTheme);

        // 3. Save to user preferences if logged in
        const user = Auth.getUserInfo();
        if (user && user.id) {
            try {
                const updatedPreferences = { ...user.preferences, theme: newTheme };
                await UserService.updateUser(user.id, { preferences: updatedPreferences });
                Auth.savePlayerInfo({ ...user, preferences: updatedPreferences });
            } catch (err) {
                console.error("Error saving theme preference", err);
            }
        }
    };

    return (
        <li className="theme-toggle-item">
            <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                className="btn-flat white-text"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '64px',
                    padding: '0 15px',
                    textTransform: 'none'
                }}
            >
                <i className="material-icons">
                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </i>
            </button>
        </li>
    );
};

export default ThemeToggle;
