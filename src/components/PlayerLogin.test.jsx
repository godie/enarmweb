import React, { useActionState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerLogin from "./PlayerLogin";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { MemoryRouter } from "react-router-dom";
import { alertError } from "../services/AlertService";

// Mock services and modules
jest.mock("../services/UserService");
jest.mock("../modules/Auth");
jest.mock('../services/AlertService');

// Mock react-router-dom hooks
let mockHistoryReplace = jest.fn();
const mockableUseLocationLogic = jest.fn(() => ({ state: { from: { pathname: "/" } } }));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useHistory: () => ({
        replace: mockHistoryReplace,
    }),
    useLocation: (...args) => mockableUseLocationLogic(...args),
}));

describe("PlayerLogin Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        alertError.mockImplementation(() => { });
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
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("should switch between login and signup", () => {
        renderPlayerLogin();
        const switchLink = screen.getByText(/regístrate aquí/i);
        fireEvent.click(switchLink);
        expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    it("should call UserService.loginPlayer on successful login", async () => {
        const mockToken = "fake_player_token";
        UserService.loginPlayer.mockResolvedValue({ data: { token: mockToken, id: 1, email: "p1@ex.com", name: "P1" } });

        renderPlayerLogin();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "p1@ex.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));

        await waitFor(() => {
            expect(UserService.loginPlayer).toHaveBeenCalled();
            expect(Auth.authenticatePlayer).toHaveBeenCalledWith(mockToken);
            expect(Auth.savePlayerInfo).toHaveBeenCalled();
            expect(mockHistoryReplace).toHaveBeenCalledWith({ pathname: "/" });
        });
    });

    it("should call UserService.createPlayer on successful signup", async () => {
        const mockToken = "new_player_token";
        UserService.createPlayer.mockResolvedValue({ data: { token: mockToken, id: 2, email: "new@ex.com", name: "New" } });

        renderPlayerLogin();
        fireEvent.click(screen.getByText(/regístrate aquí/i));

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: "New" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "new@ex.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

        await waitFor(() => {
            expect(UserService.createPlayer).toHaveBeenCalled();
            expect(Auth.authenticatePlayer).toHaveBeenCalledWith(mockToken);
        });
    });
});
