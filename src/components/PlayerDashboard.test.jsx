
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, beforeEach, it, expect } from 'vitest';
import PlayerDashboard from "./PlayerDashboard";
import ExamService from "../services/ExamService";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { MemoryRouter } from "react-router-dom";

// Mock services and modules
vi.mock("../services/ExamService", () => ({
    default: {
        loadCategories: vi.fn(),
    }
}));

vi.mock("../services/UserService", () => ({
    default: {
        getAchievements: vi.fn(),
    }
}));

vi.mock("../modules/Auth", () => ({
    default: {
        getUserInfo: vi.fn(),
    }
}));

const mockHistoryPush = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useHistory: () => ({
            push: mockHistoryPush,
        }),
    };
});

describe("PlayerDashboard Component", () => {
    const mockUser = {
        id: 1,
        name: "Test Doctor",
        preferences: {
            specialties: [1, 2]
        }
    };

    const mockCategories = {
        data: [
            { id: 1, name: "Cardiología" },
            { id: 2, name: "Pediatría" }
        ]
    };

    const mockAchievements = {
        data: [
            { id: 1, name: "Primer Paso", description: "Completaste tu primer caso" }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        Auth.getUserInfo.mockReturnValue(mockUser);
        ExamService.loadCategories.mockResolvedValue(mockCategories);
        UserService.getAchievements.mockResolvedValue(mockAchievements);
    });

    const renderDashboard = () => {
        return render(
            <MemoryRouter>
                <PlayerDashboard />
            </MemoryRouter>
        );
    };

    it("should render welcome message and categories", async () => {
        renderDashboard();

        expect(await screen.findByText(/Test Doctor/i)).toBeInTheDocument();
        expect(await screen.findByText("Cardiología")).toBeInTheDocument();
        expect(await screen.findByText("Pediatría")).toBeInTheDocument();
    });

    it("should have accessible specialty cards", async () => {
        renderDashboard();

        const cards = await screen.findAllByRole("button", { name: /Explorar especialidad/i });
        expect(cards).toHaveLength(2);
        expect(cards[0]).toHaveAttribute("tabIndex", "0");
    });

    it("should navigate when a specialty card is clicked", async () => {
        renderDashboard();

        const cardioCard = await screen.findByLabelText(/Explorar especialidad Cardiología/i);
        fireEvent.click(cardioCard);

        expect(mockHistoryPush).toHaveBeenCalledWith("/especialidad/1");
    });

    it("should navigate when Enter key is pressed on a specialty card", async () => {
        renderDashboard();

        const pediaCard = await screen.findByLabelText(/Explorar especialidad Pediatría/i);
        fireEvent.keyDown(pediaCard, { key: 'Enter' });

        expect(mockHistoryPush).toHaveBeenCalledWith("/especialidad/2");
    });

    it("should navigate when Space key is pressed on a specialty card", async () => {
        renderDashboard();

        const cardioCard = await screen.findByLabelText(/Explorar especialidad Cardiología/i);
        fireEvent.keyDown(cardioCard, { key: ' ' });

        expect(mockHistoryPush).toHaveBeenCalledWith("/especialidad/1");
    });

    it("should update focused state on mouse enter and leave", async () => {
        renderDashboard();

        const cardioCard = await screen.findByLabelText(/Explorar especialidad Cardiología/i);

        fireEvent.mouseEnter(cardioCard);
        expect(cardioCard).toHaveStyle("background-color: transparent");

        fireEvent.mouseLeave(cardioCard);
        expect(cardioCard).toHaveStyle("background-color: transparent");
    });
});
