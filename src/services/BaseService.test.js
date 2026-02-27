import { vi, describe, beforeEach, it, expect } from "vitest";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";
import { MOCK_TOKEN } from "../test/testConstants";

vi.mock("../modules/Auth");

describe("BaseService", () => {
  beforeEach(() => {
    vi.mocked(Auth.getToken).mockReturnValue(MOCK_TOKEN);
  })
  const expectedHeaders = {
    headers: { Authorization: `bearer ${MOCK_TOKEN}` },
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
