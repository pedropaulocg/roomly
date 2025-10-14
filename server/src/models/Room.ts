export interface IRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo: string | null;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomRepository {
  create(room: Omit<IRoom, "id" | "createdAt" | "updatedAt">): Promise<IRoom>;
  findAll(): Promise<IRoom[]>;
  findById(id: number): Promise<IRoom | null>;
  update(
    id: number,
    room: Omit<IRoom, "id" | "createdAt" | "updatedAt">
  ): Promise<IRoom>;
  delete(id: number): Promise<void>;
}
