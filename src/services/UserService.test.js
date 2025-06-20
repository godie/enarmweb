import axios from "axios";
import UserService from "./UserService";
import BaseService from "./BaseService";

// Mock BaseService and axios
jest.mock("./BaseService");
jest.mock("axios");

describe("UserService", () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should call axios.post with correct URL and user data", async () => {
      const user = { email: "test@example.com", password: "password123" };
      const expectedUrl = "http://api.example.com/auth_user";
      BaseService.getURL.mockReturnValue(expectedUrl);
      axios.post.mockResolvedValue({ data: { token: "fake_token" } });

      await UserService.login(user);

      expect(BaseService.getURL).toHaveBeenCalledWith("auth_user");
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, {
        email: user.email,
        password: user.password,
      });
    });

    it("should return the response from axios.post", async () => {
      const user = { email: "test@example.com", password: "password123" };
      const responseData = { data: { token: "fake_token" } };
      BaseService.getURL.mockReturnValue("http://api.example.com/auth_user");
      axios.post.mockResolvedValue(responseData);

      const result = await UserService.login(user);

      expect(result).toEqual(responseData);
    });
  });

  describe("createPlayer", () => {
    it("should call axios.post with correct URL and player params", async () => {
      const params = { name: "Test Player", score: 100 };
      const expectedUrl = "http://api.example.com/players";
      BaseService.getURL.mockReturnValue(expectedUrl);
      axios.post.mockResolvedValue({ data: { id: 1, ...params } });

      await UserService.createPlayer(params);

      expect(BaseService.getURL).toHaveBeenCalledWith("players");
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, { player: params });
    });

    it("should return the response from axios.post", async () => {
      const params = { name: "Test Player", score: 100 };
      const responseData = { data: { id: 1, ...params } };
      BaseService.getURL.mockReturnValue("http://api.example.com/players");
      axios.post.mockResolvedValue(responseData);

      const result = await UserService.createPlayer(params);

      expect(result).toEqual(responseData);
    });
  });
});
