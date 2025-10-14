import request from "./request";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "OWNER" | "CLIENT";
  createdAt: string;
  updatedAt: string;
}

// Buscar todos os usuários (clientes)
export const getAllUsers = (): Promise<User[]> => {
  return request({
    url: "/users",
    method: "GET",
  });
};

// Buscar usuário por ID
export const getUserById = (id: number): Promise<User> => {
  return request({
    url: `/users/${id}`,
    method: "GET",
  });
};
