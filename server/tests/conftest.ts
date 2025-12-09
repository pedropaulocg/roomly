import { IReservation, ReservationType } from "../src/models/Reservation";

export const resetMocks = () => {
  jest.clearAllMocks();
};

export const createMockReservation = (
  overrides?: Partial<IReservation>
): IReservation => {
  const now = new Date();
  return {
    id: 1,
    startDate: new Date("2024-01-01T10:00:00Z"),
    endDate: new Date("2024-01-01T12:00:00Z"),
    type: "HOURLY" as ReservationType,
    totalPrice: 100.0,
    clientId: 1,
    roomId: 1,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

export const createMockReservationData = (
  overrides?: Partial<Omit<IReservation, "id" | "createdAt" | "updatedAt">>
): Omit<IReservation, "id" | "createdAt" | "updatedAt"> => {
  return {
    startDate: new Date("2024-01-01T10:00:00Z"),
    endDate: new Date("2024-01-01T12:00:00Z"),
    type: "HOURLY" as ReservationType,
    totalPrice: 100.0,
    clientId: 1,
    roomId: 1,
    ...overrides,
  };
};
