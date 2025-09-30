import { IUser } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";

type UserCreateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;
type UserUpdateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;

export class UserServices {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(user: UserCreateData): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.userRepository.create({ ...user, password: hashedPassword });
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(id: number, user: UserUpdateData): Promise<IUser> {
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
