import { prisma } from "../config/prisma";
import { IUser, IUserRepository, PaginatedResult } from "../models/User";

type UserCreateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;
type UserUpdateData = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "rooms" | "reservations"
>;

export class UserRepository implements IUserRepository {
  async create(
    user: UserCreateData,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
    }
  ): Promise<IUser> {
    const include: any = {};
    if (options?.includeRooms) include.rooms = true;
    if (options?.includeReservations) include.reservations = true;

    return prisma.user.create({
      data: user,
      include: Object.keys(include).length > 0 ? include : undefined,
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    includeRooms?: boolean;
    includeReservations?: boolean;
  }): Promise<IUser[] | PaginatedResult<IUser>> {
    const page = options?.page;
    const limit = options?.limit;
    const include: any = {};
    if (options?.includeRooms) include.rooms = true;
    if (options?.includeReservations) include.reservations = true;

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          include: Object.keys(include).length > 0 ? include : undefined,
        }),
        prisma.user.count(),
      ]);
      return { data, total, page, limit };
    }

    return prisma.user.findMany({
      include: Object.keys(include).length > 0 ? include : undefined,
    });
  }

  async findById(
    id: number,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
      useSelect?: boolean;
    }
  ): Promise<IUser | null> {
    if (options?.useSelect) {
      const select: any = {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      };

      if (options?.includeRooms) {
        select.rooms = {
          select: {
            id: true,
            name: true,
            capacity: true,
            location: true,
            pricePerHour: true,
            pricePerDay: true,
            photo: true,
            createdAt: true,
            updatedAt: true,
          },
        };
      }

      if (options?.includeReservations) {
        select.reservations = {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            type: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
          },
        };
      }

      return prisma.user.findUnique({
        where: { id },
        select,
      }) as Promise<IUser | null>;
    }

    const include: any = {};
    if (options?.includeRooms) include.rooms = true;
    if (options?.includeReservations) include.reservations = true;

    return prisma.user.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });
  }

  async findByEmail(
    email: string,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
    }
  ): Promise<IUser | null> {
    const include: any = {};
    if (options?.includeRooms) include.rooms = true;
    if (options?.includeReservations) include.reservations = true;

    return prisma.user.findUnique({
      where: { email },
      include: Object.keys(include).length > 0 ? include : undefined,
    });
  }

  async update(
    id: number,
    user: UserUpdateData,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
    }
  ): Promise<IUser> {
    const include: any = {};
    if (options?.includeRooms) include.rooms = true;
    if (options?.includeReservations) include.reservations = true;

    return prisma.user.update({
      where: { id },
      data: user,
      include: Object.keys(include).length > 0 ? include : undefined,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
