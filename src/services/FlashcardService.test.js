import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import BaseService from "./BaseService";
import FlashcardService from "./FlashcardService";

vi.mock("axios");
vi.mock("./BaseService");

describe("FlashcardService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requests due flashcards with auth headers", async () => {
    const headers = { headers: { Authorization: "bearer token" }, params: {} };
    vi.mocked(BaseService.getURL).mockReturnValue("http://api.example.com/flashcards/due");
    vi.spyOn(FlashcardService, "getHeaders").mockReturnValue(headers);
    vi.mocked(axios.get).mockResolvedValue({ data: [] });

    await FlashcardService.getDueFlashcards();

    expect(BaseService.getURL).toHaveBeenCalledWith("flashcards/due");
    expect(axios.get).toHaveBeenCalledWith("http://api.example.com/flashcards/due", headers);
  });

  it("sends review quality to review endpoint", async () => {
    const headers = { headers: { Authorization: "bearer token" }, params: {} };
    vi.mocked(BaseService.getURL).mockReturnValue("http://api.example.com/flashcards/3/review");
    vi.spyOn(FlashcardService, "getHeaders").mockReturnValue(headers);
    vi.mocked(axios.post).mockResolvedValue({ data: { id: 9 } });

    await FlashcardService.reviewFlashcard(3, 5);

    expect(BaseService.getURL).toHaveBeenCalledWith("flashcards/3/review");
    expect(axios.post).toHaveBeenCalledWith("http://api.example.com/flashcards/3/review", { quality: 5 }, headers);
  });
});
