import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Flashcards from "./Flashcards";
import FlashcardService from "../../services/FlashcardService";

vi.mock("../../services/FlashcardService", () => ({
  default: {
    getDueFlashcards: vi.fn(),
    reviewFlashcard: vi.fn(),
  },
}));

vi.mock("../../services/AlertService", () => ({
  alertSuccess: vi.fn(),
  alertError: vi.fn(),
}));

describe("Flashcards page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders due flashcard and reviews it", async () => {
    FlashcardService.getDueFlashcards.mockResolvedValue({
      data: [
        {
          id: 10,
          flashcard: {
            id: 42,
            question: "Pregunta ENARM",
            answer: "Respuesta ENARM",
          },
        },
      ],
    });
    FlashcardService.reviewFlashcard.mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <Flashcards />
      </MemoryRouter>
    );

    expect(await screen.findByText("Pregunta ENARM")).toBeInTheDocument();
    expect(screen.getByText("Respuesta ENARM")).toBeInTheDocument();

    fireEvent.click(screen.getByText("5 - Perfecta"));

    expect(FlashcardService.reviewFlashcard).toHaveBeenCalledWith(42, 5);
    expect(await screen.findByText(/Sin pendientes por ahora/i)).toBeInTheDocument();
  });
});
