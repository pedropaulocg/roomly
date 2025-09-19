
export type ReservationType = "HOURLY" | "DAILY";

export interface IReservation {
  id: number;
  startDate: Date;
  endDate: Date;
  type: ReservationType;
  totalPrice: number;
  clientId: number;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReservationRepository {
  create(reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation>;
  findAll(): Promise<IReservation[]>;
  findById(id: number): Promise<IReservation | null>;
  findConflicts(roomId: number, startDate: Date, endDate: Date): Promise<IReservation[]>;
  update(id: number, reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation>;
  delete(id: number): Promise<void>;
}
