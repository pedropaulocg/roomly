import { AuthService } from "../services/AuthService";
import { Request, Response } from "express";

type AuthRequest = {
  email: string;
  password: string;
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body as AuthRequest;
    const auth = await this.authService.login(email, password);
    res.status(200).json(auth);
  }
}