import axios from "axios";

const BACKEND_URL = "http://198.211.105.95:8080";

export function useSignup() {
  const register = async (user: {
    email: string;
    passwd: string;
  }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/register`, user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Error al registrar el usuario" };
    }
  };

  return { register };
}

export function useLogin() {
  const login = async (user: { email: string; passwd: string }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/login`, user);
      return { success: true, token: response.data.data.token };
    } catch (error: any) {
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}






