import axios from "axios";
import ExamService from "./ExamService";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";

// Mock dependencies
jest.mock("./BaseService");
jest.mock("../modules/Auth");
jest.mock("axios");

const mockToken = "test_token";
const baseApiUrl = "http://api.example.com";

describe("ExamService", () => {
  beforeEach(() => {
    // Setup mocks before each test
    Auth.getToken.mockReturnValue(mockToken);
    BaseService.getURL.mockImplementation(path => `${baseApiUrl}/${path}`);
    axios.get.mockResolvedValue({ data: {} });
    axios.post.mockResolvedValue({ data: {} });
    axios.put.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  const expectedHeaders = {
    headers: { Authorization: `bearer ${mockToken}` },
  };

  describe("getHeaders", () => {
    it("should return correct authorization headers", () => {
      const headers = ExamService.getHeaders();
      expect(Auth.getToken).toHaveBeenCalled();
      expect(headers).toEqual(expectedHeaders);
    });
  });

  describe("getExams", () => {
    it("should call axios.get with correct URL, headers, and params", async () => {
      const page = 1;
      const expectedUrl = `${baseApiUrl}/clinical_cases`;
      await ExamService.getExams(page);
      expect(BaseService.getURL).toHaveBeenCalledWith("clinical_cases");
      expect(Auth.getToken).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        ...expectedHeaders,
        params: { page: page },
      });
    });
  });

  describe("getQuestions", () => {
    it("should call axios.get with correct URL and headers", async () => {
      const clinicCaseId = "case123";
      const expectedUrl = `${baseApiUrl}/clinical_cases/${clinicCaseId}`;
      // Mock getHeaders directly for this class if it's static and calls itself
      const getHeadersSpy = jest.spyOn(ExamService, 'getHeaders').mockReturnValue(expectedHeaders);

      await ExamService.getQuestions(clinicCaseId);

      expect(BaseService.getURL).toHaveBeenCalledWith(`clinical_cases/${clinicCaseId}`);
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      getHeadersSpy.mockRestore();
    });
  });

  describe("getCaso", () => {
    it("should call axios.get with correct URL and headers", async () => {
      const clinicCaseId = "case456";
      const expectedUrl = `${baseApiUrl}/clinical_cases/${clinicCaseId}`;
      const getHeadersSpy = jest.spyOn(ExamService, 'getHeaders').mockReturnValue(expectedHeaders);

      await ExamService.getCaso(clinicCaseId);

      expect(BaseService.getURL).toHaveBeenCalledWith(`clinical_cases/${clinicCaseId}`);
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      getHeadersSpy.mockRestore();
    });
  });

  describe("loadCategories", () => {
    it("should call axios.get with correct URL and headers", async () => {
      const expectedUrl = `${baseApiUrl}/categories`;
      const getHeadersSpy = jest.spyOn(ExamService, 'getHeaders').mockReturnValue(expectedHeaders);
      await ExamService.loadCategories();
      expect(BaseService.getURL).toHaveBeenCalledWith("categories");
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      getHeadersSpy.mockRestore();
    });
  });

  describe("saveCaso", () => {
    const casoNew = { description: "New Case" }; // No ID
    const casoExisting = { id: 1, description: "Existing Case" };

    it("should call axios.post for a new caso", async () => {
      const expectedUrl = `${baseApiUrl}/clinical_cases`;
      await ExamService.saveCaso(casoNew);
      expect(BaseService.getURL).toHaveBeenCalledWith("clinical_cases");
      expect(Auth.getToken).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, { clinical_case: casoNew }, expectedHeaders);
      expect(axios.put).not.toHaveBeenCalled();
    });

    it("should call axios.put for an existing caso", async () => {
      const {id} = casoExisting
      const expectedUrl = `${baseApiUrl}/clinical_cases/${id}`;
      await ExamService.saveCaso(casoExisting);
      expect(BaseService.getURL).toHaveBeenCalledWith(`clinical_cases/${id}`);
      expect(Auth.getToken).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(expectedUrl, { clinical_case: casoExisting }, expectedHeaders);
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("sendAnswers", () => {
    const answersNew = { questionId: 1, answer: "A" }; // No ID
    const answersExisting = { id: 1, questionId: 1, answer: "B" };

    it("should call axios.post for new answers", async () => {
      const expectedUrl = `${baseApiUrl}/player_answers`;
      await ExamService.sendAnswers(answersNew);
      expect(BaseService.getURL).toHaveBeenCalledWith("player_answers");
      expect(Auth.getToken).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, answersNew, expectedHeaders);
      expect(axios.put).not.toHaveBeenCalled();
    });

    it("should call axios.put for existing answers", async () => {
      const expectedUrl = `${baseApiUrl}/player_answers/${answersExisting.id}`;
      await ExamService.sendAnswers(answersExisting);
      expect(BaseService.getURL).toHaveBeenCalledWith(`player_answers/${answersExisting.id}`);
      expect(Auth.getToken).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(expectedUrl, answersExisting, expectedHeaders);
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("saveCategory", () => {
    const categoryNew = { name: "Cardiology" }; // No ID
    const categoryExisting = { id: 1, name: "Neurology" };
    let getHeadersSpy;

    beforeEach(() => {
      getHeadersSpy = jest.spyOn(ExamService, 'getHeaders').mockReturnValue(expectedHeaders);
    });

    afterEach(() => {
        getHeadersSpy.mockRestore();
    });

    it("should call axios.post for a new category", async () => {
      const expectedUrl = `${baseApiUrl}/categories`;
      await ExamService.saveCategory(categoryNew);
      expect(BaseService.getURL).toHaveBeenCalledWith("categories");
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, categoryNew, expectedHeaders);
      expect(axios.put).not.toHaveBeenCalled();
    });

    it("should call axios.put for an existing category", async () => {
      const expectedUrl = `${baseApiUrl}/categories/${categoryExisting.id}`;
      await ExamService.saveCategory(categoryExisting);
      expect(BaseService.getURL).toHaveBeenCalledWith(`categories/${categoryExisting.id}`);
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(expectedUrl, categoryExisting, expectedHeaders);
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("getCategory", () => {
    it("should call axios.get with correct URL and headers for a specific category", async () => {
      const categoryId = 123;
      const expectedUrl = `${baseApiUrl}/categories/${categoryId}`;
      const getHeadersSpy = jest.spyOn(ExamService, 'getHeaders').mockReturnValue(expectedHeaders);

      await ExamService.getCategory(categoryId);

      expect(BaseService.getURL).toHaveBeenCalledWith(`categories/${categoryId}`);
      expect(getHeadersSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      getHeadersSpy.mockRestore();
    });
  });
});
