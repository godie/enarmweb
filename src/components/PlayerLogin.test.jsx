
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, beforeEach, it, expect } from 'vitest';
import PlayerLogin from "./PlayerLogin";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { MemoryRouter } from "react-router-dom";
import { MOCK_PLAYER_TOKEN } from "../test/testConstants";


// Mock services and modules
vi.mock("../services/UserService", () => ({
    default: {
        loginPlayer: vi.fn(),
        createUser: vi.fn(),
    }
}));

vi.mock("../modules/Auth", () => ({
    default: {
        authenticatePlayer: vi.fn(),
        savePlayerInfo: vi.fn(),
        isFacebookUser: vi.fn(),
        getFacebookUser: vi.fn(),
    }
}));

vi.mock('../services/AlertService', () => ({
    alertError: vi.fn(),
}));

vi.mock('./google/GoogleLoginContainer', () => ({
    default: () => <div data-testid="google-login-mock">Google Login</div>
}));

vi.mock('./facebook/FacebookLoginContainer', () => ({
    default: () => <div data-testid="facebook-login-mock">Facebook Login</div>
}));

const mockHistoryReplace = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useHistory: () => ({
            replace: mockHistoryReplace,
        }),
        useLocation: () => ({ state: { from: { pathname: "/" } } }),
    };
});

describe("PlayerLogin Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPlayerLogin = () => {
        return render(
            <MemoryRouter initialEntries={["/login"]}>
                <PlayerLogin />
            </MemoryRouter>
        );
    };

    it("should render login form elements", () => {
        renderPlayerLogin();
        expect(screen.getAllByLabelText(/email o usuario/i).length).toBeGreaterThan(0);
        expect(screen.getAllByLabelText(/Contraseña/i).length).toBeGreaterThan(0);
        expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("should switch between login and signup", () => {
        renderPlayerLogin();
        const switchLink = screen.getByText(/regístrate aquí/i);
        fireEvent.click(switchLink);
        expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    });

    it("should call UserService.loginPlayer on successful login", async () => {
        UserService.loginPlayer.mockResolvedValue({ data: { token: MOCK_PLAYER_TOKEN, id: 1, email: "p1@ex.com", name: "P1", role: 'player' } });

        renderPlayerLogin();

        fireEvent.change(screen.getByLabelText(/email o usuario/i), { target: { value: "p1@ex.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i, { selector: 'input' }), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));

        await waitFor(() => {
            expect(UserService.loginPlayer).toHaveBeenCalled();
            expect(Auth.authenticatePlayer).toHaveBeenCalledWith(MOCK_PLAYER_TOKEN);
            expect(Auth.savePlayerInfo).toHaveBeenCalled();
            expect(mockHistoryReplace).toHaveBeenCalled();
        });
    });

    it("should call UserService.createUser on successful signup", async () => {
        UserService.createUser.mockResolvedValue({ data: { token: MOCK_PLAYER_TOKEN, id: 2, email: "new@ex.com", name: "New", role: 'player' } });

        renderPlayerLogin();
        fireEvent.click(screen.getByText(/regístrate aquí/i));

        fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: "New" } });
        fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: "newuser" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "new@ex.com" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

        await waitFor(() => {
            expect(UserService.createUser).toHaveBeenCalled();
            expect(Auth.authenticatePlayer).toHaveBeenCalledWith(MOCK_PLAYER_TOKEN);
        });
    });
});
