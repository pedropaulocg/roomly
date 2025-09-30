// api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

const service = () => {
  const tokenAuth = localStorage.getItem("token");
  const token = tokenAuth ? `Bearer ${tokenAuth}` : "";

  const baseUrl = import.meta.env.VITE_API_URL;

  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }


  );

  return api;
}


export default service;
