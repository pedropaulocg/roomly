// usar interface para desacoplar da implementação do prisma

import { IReservation } from "./Reservation";
import { IRoom } from "./Room";

export type UserRole = "OWNER" | "CLIENT";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rooms?: IRoom[];
  reservations?: IReservation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IUserRepository {
  create(
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
    options?: { includeRooms?: boolean; includeReservations?: boolean }
  ): Promise<IUser>;
  findAll(options?: {
    page?: number;
    limit?: number;
    includeRooms?: boolean;
    includeReservations?: boolean;
  }): Promise<IUser[] | PaginatedResult<IUser>>;
  findById(
    id: number,
    options?: {
      includeRooms?: boolean;
      includeReservations?: boolean;
      useSelect?: boolean;
    }
  ): Promise<IUser | null>;
  findByEmail(
    email: string,
    options?: { includeRooms?: boolean; includeReservations?: boolean }
  ): Promise<IUser | null>;
  update(
    id: number,
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
    options?: { includeRooms?: boolean; includeReservations?: boolean }
  ): Promise<IUser>;
  delete(id: number): Promise<void>;
}
