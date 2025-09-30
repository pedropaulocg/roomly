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

export interface IUserRepository {
  create(user: Omit<IUser, "id" | "createdAt" | "updatedAt">): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(
    id: number,
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser>;
  delete(id: number): Promise<void>;
}
