import { UserController } from "../controllers/UserController";
import { Router, Request, Response } from "express";

const userRoutes = Router();

const userController = new UserController();

userRoutes.post('/', (req: Request, res: Response) => userController.createUser(req, res));
userRoutes.get('/', (req: Request, res: Response) => userController.getAllUsers(req, res));
userRoutes.get('/:id', (req: Request, res: Response) => userController.getUserById(req, res));
userRoutes.put('/:id', (req: Request, res: Response) => userController.updateUser(req, res));
userRoutes.delete('/:id', (req: Request, res: Response) => userController.deleteUser(req, res));

export default userRoutes;