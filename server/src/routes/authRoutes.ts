import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { TokenService } from "../helpers/TokenService";
import { UserRepository } from "../repositories/UserRepository";

const authRoutes = Router();

const authController = new AuthController(new AuthService(new TokenService(process.env.JWT_SECRET!), new UserRepository()));

authRoutes.post('/login', (req: Request, res: Response) => authController.login(req, res));

export default authRoutes;