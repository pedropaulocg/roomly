import request from "./request"

type LoginData = {
  email: string;
  password: string;
}

export const login = (data: LoginData) => {
  return request({
    url: "/auth/login",
    method: "POST",
    data,
  })
}