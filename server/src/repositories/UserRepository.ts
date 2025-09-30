import { prisma } from "../config/prisma";
import { IUser, IUserRepository } from "../models/User";

type UserCreateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;
type UserUpdateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;

export class UserRepository implements IUserRepository {
  async create(user: UserCreateData): Promise<IUser> {
    return prisma.user.create({
      data: user,
      include: { rooms: true, reservations: true },
    });
  }

  async findAll(): Promise<IUser[]> {
    return prisma.user.findMany({
      include: { rooms: true, reservations: true },
    });
  }

  async findById(id: number): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { rooms: true, reservations: true },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { rooms: true, reservations: true },
    });
  }

  async update(id: number, user: UserUpdateData): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data: user,
      include: { rooms: true, reservations: true },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
