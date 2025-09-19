import { IUser, UserRole } from "../models/User";
import { UserServices } from "../services/UserServices";
import { Request, Response } from "express";

type UserRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UserController {
  private userServices: UserServices;

  constructor() {
    this.userServices = new UserServices();
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password, role } = req.body as UserRequest;
    const user = await this.userServices.createUser({ name, email, password, role });
    res.status(201).json(user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userServices.getAllUsers();
    res.status(200).json(users);
  }
  
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userServices.getUserById(Number(id));
    res.status(200).json(user);
  }
  
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password, role } = req.body as UserRequest;
    const user = await this.userServices.updateUser(Number(id), { name, email, password, role });
    res.status(200).json(user);
  }
  
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await this.userServices.deleteUser(Number(id));
    res.status(200).json({ message: "User deleted successfully" });
  }
}