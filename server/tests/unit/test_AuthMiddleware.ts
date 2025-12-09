import { Response, NextFunction } from "express";
import { TokenPayload } from "../../src/models/Auth";
import { resetMocks } from "../conftest";

const mockVerify = jest.fn();

jest.mock("../../src/helpers/TokenService", () => {
  return {
    TokenService: jest.fn().mockImplementation(() => ({
      verify: mockVerify,
      generate: jest.fn(),
    })),
  };
});

import { AuthMiddleware, AuthRequest } from "../../src/middlewares/authMiddleware";

describe("AuthMiddleware", () => {
  let middleware: AuthMiddleware;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new AuthMiddleware();
    resetMocks();
    jest.clearAllMocks();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("handle", () => {
    it("deve retornar erro 401 quando authorization header não é fornecido", async () => {
      mockRequest.headers = {};

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token não fornecido",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando token não é fornecido no header", async () => {
      mockRequest.headers = {
        authorization: "Bearer ",
      };

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token não fornecido",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve chamar next quando token é válido", async () => {
      const token = "valid_token";
      const payload: TokenPayload = {
        sub: "1",
        role: "CLIENT",
        iat: 1234567890,
        exp: 1234567890,
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };
      mockVerify.mockReturnValue(payload);

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockVerify).toHaveBeenCalledWith(token);
      expect(mockRequest.user).toEqual({ id: "1", role: "CLIENT" });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 com código TOKEN_EXPIRED quando token está expirado", async () => {
      const token = "expired_token";
      const error = new Error("Token expirado");
      (error as any).name = "TokenExpiredError";

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };
      mockVerify.mockImplementation(() => {
        throw error;
      });

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 com código TOKEN_INVALID quando token é inválido", async () => {
      const token = "invalid_token";
      const error = new Error("Token inválido");
      (error as any).name = "JsonWebTokenError";

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };
      mockVerify.mockImplementation(() => {
        throw error;
      });

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token inválido",
        code: "TOKEN_INVALID",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 com código TOKEN_ERROR para outros erros", async () => {
      const token = "error_token";
      const error = new Error("Erro desconhecido");
      (error as any).name = "UnknownError";

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };
      mockVerify.mockImplementation(() => {
        throw error;
      });

      await middleware.handle(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Erro ao verificar token",
        code: "TOKEN_ERROR",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
