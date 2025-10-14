import request from "./request";

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomData {
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo?: string;
  ownerId: number;
}

export interface UpdateRoomData {
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo?: string;
  ownerId: number;
}

// Buscar todos os quartos
export const getAllRooms = (): Promise<Room[]> => {
  return request({
    url: "/rooms",
    method: "GET",
  });
};

// Buscar quarto por ID
export const getRoomById = (id: number): Promise<Room> => {
  return request({
    url: `/rooms/${id}`,
    method: "GET",
  });
};

// Criar novo quarto
export const createRoom = (data: CreateRoomData): Promise<Room> => {
  return request({
    url: "/rooms",
    method: "POST",
    data,
  });
};

// Atualizar quarto
export const updateRoom = (id: number, data: UpdateRoomData): Promise<Room> => {
  return request({
    url: `/rooms/${id}`,
    method: "PUT",
    data,
  });
};

// Excluir quarto
export const deleteRoom = (id: number): Promise<{ message: string }> => {
  return request({
    url: `/rooms/${id}`,
    method: "DELETE",
  });
};
