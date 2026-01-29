import { vi, describe, beforeEach, it, expect } from "vitest";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";

vi.mock("../modules/Auth");

const mockToken = "test_token";
describe("BaseService", () => {
  beforeEach(() => {
    vi.mocked(Auth.getToken).mockReturnValue(mockToken);
  })
  const expectedHeaders = {
    headers: { Authorization: `bearer ${mockToken}` },
    params: {}
  };

  describe("getHeaders", () => {
    it("should return correct authorization headers", () => {
      const headers = BaseService.getHeaders();
      expect(Auth.getToken).toHaveBeenCalled();
      expect(headers).toEqual(expectedHeaders);
    });
  });
})
