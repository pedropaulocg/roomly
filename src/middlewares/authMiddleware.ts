import { Request, Response, NextFunction } from "express";
import { TokenService } from "../helpers/TokenService";

const tokenService = new TokenService(process.env.JWT_SECRET || "default_secret");

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export class AuthMiddleware {
  constructor() {}

  handle = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    try {
      const payload = tokenService.verify(token) as any;
      req.user = { id: payload.sub, role: payload.role };
      return next();
    } catch {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  };
}
