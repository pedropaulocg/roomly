import request from "./request";

export type ReservationType = "HOURLY" | "DAILY";

export interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  type: ReservationType;
  totalPrice: number;
  clientId: number;
  roomId: number;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  roomName?: string;
}

export interface CreateReservationData {
  startDate: string;
  endDate: string;
  type: ReservationType;
  totalPrice: number;
  clientId: number;
  roomId: number;
}

export interface UpdateReservationData {
  startDate: string;
  endDate: string;
  type: ReservationType;
  totalPrice: number;
  clientId: number;
  roomId: number;
}

// Buscar todas as reservas
export const getAllReservations = (): Promise<Reservation[]> => {
  return request({
    url: "/reservations",
    method: "GET",
  });
};

// Buscar reserva por ID
export const getReservationById = (id: number): Promise<Reservation> => {
  return request({
    url: `/reservations/${id}`,
    method: "GET",
  });
};

// Criar nova reserva
export const createReservation = (
  data: CreateReservationData
): Promise<Reservation> => {
  return request({
    url: "/reservations",
    method: "POST",
    data,
  });
};

// Atualizar reserva
export const updateReservation = (
  id: number,
  data: UpdateReservationData
): Promise<Reservation> => {
  return request({
    url: `/reservations/${id}`,
    method: "PUT",
    data,
  });
};

// Excluir reserva
export const deleteReservation = (id: number): Promise<{ message: string }> => {
  return request({
    url: `/reservations/${id}`,
    method: "DELETE",
  });
};
