import axios from "axios";

const BACKEND_URL = "http://198.211.105.95:8080";

export function useSignup() {
  const register = async (user: {
    email: string;
    passwd: string;
  }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/register`, user);
      return { success: true, token: response.data.token };
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

export async function getExpensesSummary(token: string) {
  try {
    const response = await axios.get(
      "http://198.211.105.95:8080/expenses_summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "No se pudo obtener el resumen de gastos" };
  }
}

export async function getExpensesDetail(
  token: string,
  year: number,
  month: number,
  categoryId: number
) {
  try {
    const response = await axios.get(
      `http://198.211.105.95:8080/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "No se pudo obtener el detalle de gastos" };
  }
}






