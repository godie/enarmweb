import asyncio
import os
import json
from playwright.async_api import async_playwright

# Configuración básica
# TODO: Inyectar la URL desde el environment para despliegues dinámicos
BASE_URL = os.environ.get("APP_URL", "http://localhost:5173")
SCREENSHOT_DIR = "automation/screenshots"

# Mock de datos para simular sesión
# TODO: Cambiar por credenciales reales y flujo de login automatizado en el futuro
MOCK_USER = {
    "id": 1,
    "nickname": "TestUser",
    "role": "admin", # Para capturar pantallas de admin también
    "email": "test@enarmweb.com"
}
MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.mock_signature"

ROUTES = [
    # Públicas
    {"path": "/#/", "name": "01_Landing"},
    {"path": "/#/login", "name": "02_Login_Player"},
    {"path": "/#/admin", "name": "03_Login_Admin"},

    # Jugador (Player)
    {"path": "/#/", "name": "04_Player_Dashboard", "auth": True},
    {"path": "/#/perfil", "name": "05_Player_Profile", "auth": True},
    {"path": "/#/contribuir", "name": "06_Player_Contribuir", "auth": True},
    {"path": "/#/mis-contribuciones", "name": "07_Player_Mis_Contribuciones", "auth": True},
    {"path": "/#/onboarding", "name": "08_Player_Onboarding", "auth": True},
    {"path": "/#/especialidad/1", "name": "09_Player_Especialidad_Casos", "auth": True},
    {"path": "/#/caso/test-id", "name": "10_Player_Examen_Caso", "auth": True},

    # Admin
    {"path": "/#/dashboard", "name": "11_Admin_Dashboard", "auth": True},
    {"path": "/#/dashboard/casos/1", "name": "12_Admin_Casos_List", "auth": True},
    {"path": "/#/dashboard/new/caso", "name": "13_Admin_Nuevo_Caso", "auth": True},
    {"path": "/#/dashboard/especialidades", "name": "14_Admin_Especialidades", "auth": True},
    {"path": "/#/dashboard/players", "name": "15_Admin_Players", "auth": True},
    {"path": "/#/dashboard/examenes", "name": "16_Admin_Examenes", "auth": True},
    {"path": "/#/dashboard/new/exam", "name": "17_Admin_Nuevo_Examen", "auth": True},
]

async def inject_auth(context):
    """Simula la autenticación inyectando datos en LocalStorage."""
    await context.add_init_script(f"""
        localStorage.setItem('token', '{MOCK_TOKEN}');
        localStorage.setItem('userInfo', '{json.dumps(MOCK_USER)}');
    """)

async def run():
    if not os.path.exists(SCREENSHOT_DIR):
        os.makedirs(SCREENSHOT_DIR)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800}
        )

        page = await context.new_page()

        for route in ROUTES:
            url = f"{BASE_URL}{route['path']}"
            print(f"Capturando {route['name']} desde {url}...")

            if route.get("auth"):
                await inject_auth(context)
            else:
                # Limpiar storage para rutas públicas si es necesario
                await context.add_init_script("localStorage.clear();")

            try:
                await page.goto(url, wait_until="networkidle")
                # Pequeña espera adicional para animaciones de Materialize
                await page.wait_for_timeout(1000)

                screenshot_path = os.path.join(SCREENSHOT_DIR, f"{route['name']}.png")
                await page.screenshot(path=screenshot_path, full_page=True)
                print(f"Guardado en {screenshot_path}")
            except Exception as e:
                print(f"Error capturando {route['name']}: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
