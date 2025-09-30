// AFTER: Using explicit types and interfaces
// Files: TokenService.ts, authMiddleware.ts, User.ts

// TokenService.ts
interface TokenPayload {
  id: number;
  role: UserRole;
}

export class TokenService implements IAuth {
  generate(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "secret");
  }

  verify(token: string): TokenPayload {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as TokenPayload;
  }
}

// authMiddleware.ts
interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// User.ts
export enum UserRole {
  OWNER = "OWNER",
  CLIENT = "CLIENT",
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
