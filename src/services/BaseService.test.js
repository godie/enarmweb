import BaseService from "./BaseService";
import Auth from "../modules/Auth";

jest.mock("../modules/Auth");

const mockToken = "test_token";
describe("BaseService", () => {
    beforeEach(() => {
        Auth.getToken.mockReturnValue(mockToken);
    })
    const expectedHeaders = {
        headers: { Authorization: `bearer ${mockToken}` },
    };
    
describe("getHeaders", () => {
    it("should return correct authorization headers", () => {
      const headers = BaseService.getHeaders();
      expect(Auth.getToken).toHaveBeenCalled();
      expect(headers).toEqual(expectedHeaders);
    });
  });
})
