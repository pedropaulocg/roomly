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

  async getAllUsers(options?: {
    page?: number;
    limit?: number;
    includeRooms?: boolean;
    includeReservations?: boolean;
  }): Promise<
    IUser[] | { data: IUser[]; total: number; page: number; limit: number }
  > {
    const result = await this.userRepository.findAll(options);
    return result;
  }

  async getUserById(
    id: number,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
      useSelect?: boolean;
    }
  ): Promise<IUser | null> {
    const user = await this.userRepository.findById(id, options);

    if (
      user &&
      !options?.useSelect &&
      (options?.includeRooms || options?.includeReservations)
    ) {
      return JSON.parse(
        JSON.stringify(user, (key, value) => {
          if (key === "owner" && value?.rooms) {
            return { id: value.id, name: value.name };
          }
          if (key === "client" && value?.reservations) {
            return { id: value.id, name: value.name };
          }
          if (key === "room" && value?.reservations) {
            return { id: value.id, name: value.name };
          }
          return value;
        })
      );
    }

    return user;
  }

  async updateUser(id: number, user: UserUpdateData): Promise<IUser> {
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
