import axios from "axios";
import { useToken } from "./contexts/TokenContext";

const BACKEND_URL = "http://localhost:8080";

export function useSignup() {
  const register = async (user: {
    email: string;
    password: string;
    firstname: string;
    role: string;
  }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/register`, user);
      return { success: true, token: response.data.token };
    } catch {
      return { success: false, error: "Error al registrar el usuario" };
    }
  };

  return { register };
}

export function useLogin() {
  const login = async (user: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/login`, user);
      return { success: true, token: response.data.token };
    } catch {
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}






