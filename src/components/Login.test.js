import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Login";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { MemoryRouter } from "react-router-dom"; // Removed useHistory, useLocation direct import

// Mock services and modules
jest.mock("../services/UserService");
jest.mock("../modules/Auth");
jest.mock("sweetalert2-react", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

// Mock react-router-dom hooks
let mockHistoryReplace = jest.fn();
const mockableUseLocationLogic = jest.fn(() => ({ state: { from: { pathname: "/dashboard" } } }));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  useLocation: (...args) => mockableUseLocationLogic(...args),
}));

// Mock Materialize M object
global.M = {
  updateTextFields: jest.fn(),
  Modal: {
    init: jest.fn(),
  },
  validate_field: jest.fn(),
};

// Suppress console.error for expected error messages during tests
let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  global.M.updateTextFields.mockClear();
  global.M.Modal.init.mockClear();
  global.M.validate_field.mockClear();
  // Reset mockableUseLocationLogic to its default implementation before each test
  mockableUseLocationLogic.mockImplementation(() => ({ state: { from: { pathname: "/dashboard" } } }));
  mockHistoryReplace.mockClear();
});

afterEach(() => {
  jest.clearAllMocks();
  consoleErrorSpy.mockRestore();
});

describe("Login Component", () => {
  const renderLogin = (initialPath = "/login") => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Login />
      </MemoryRouter>
    );
  };

  it("should render login form elements", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should call UserService.login and Auth.authenticateUser on successful login, then redirect", async () => {
    const mockToken = "fake_token";
    UserService.login.mockResolvedValue({ data: { token: mockToken } });
    Auth.authenticateUser.mockImplementation(() => {});

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(UserService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(Auth.authenticateUser).toHaveBeenCalledWith(mockToken);
      expect(mockHistoryReplace).toHaveBeenCalledWith({ pathname: "/dashboard" });
    });
  });

  it("should show an error (and not redirect) on failed login", async () => {
    const errorMessage = "Invalid credentials";
    UserService.login.mockRejectedValue(new Error(errorMessage));

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));

    expect(UserService.login).toHaveBeenCalledWith({
      email: "wrong@example.com",
      password: "wrongpassword",
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(Auth.authenticateUser).not.toHaveBeenCalled();
    expect(mockHistoryReplace).not.toHaveBeenCalled();
  });

  it("should use 'from' location from router state if available", async () => {
    const mockToken = "another_fake_token";
    UserService.login.mockResolvedValue({ data: { token: mockToken } });
    Auth.authenticateUser.mockImplementation(() => {});

    // Key change here: using mockImplementation instead of mockImplementationOnce
    mockableUseLocationLogic.mockImplementation(() => ({
      state: { from: { pathname: "/custom-path" } }
    }));

    render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(mockHistoryReplace).toHaveBeenCalledWith({ pathname: "/custom-path" }));
  });
});
