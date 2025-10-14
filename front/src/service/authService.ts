import request from "./request";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "OWNER" | "CLIENT";
};

export const login = (data: LoginData) => {
  return request({
    url: "/auth/login",
    method: "POST",
    data,
  });
};

export const register = (data: RegisterData) => {
  return request({
    url: "/users",
    method: "POST",
    data,
  });
};
