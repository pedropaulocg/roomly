import { Request, Response, NextFunction } from "express";
import { TokenService } from "../helpers/TokenService";
import { TokenPayload } from "../models/Auth";

const tokenService = new TokenService(
  process.env.JWT_SECRET || "default_secret"
);

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export class AuthMiddleware {
  constructor() {}

  handle = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
    try {
      const payload = tokenService.verify<TokenPayload>(token);
      req.user = { id: payload.sub, role: payload.role };
      return next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expirado",
          code: "TOKEN_EXPIRED",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Token inválido",
          code: "TOKEN_INVALID",
        });
      }
      return res.status(401).json({
        message: "Erro ao verificar token",
        code: "TOKEN_ERROR",
      });
    }
  };
}
