// BEFORE: Using explicit 'any' types
// Files: TokenService.ts, authMiddleware.ts, User.ts

// TokenService.ts
export class TokenService implements IAuth {
  generate(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "secret");
  }

  verify(token: any): any {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
  }
}

// authMiddleware.ts
export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// User.ts
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: any;
  createdAt: Date;
  updatedAt: Date;
}
