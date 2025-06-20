import axios from "axios";

export const BACKEND_URL = "http://198.211.105.95:8080";

export function useSignup() {
  const register = async (user: { email: string; passwd: string }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/register`, user);
      return { success: true, token: response.data.token };
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al registrar el usuario";
      return { success: false, error: message };
    }
  };
  return { register };
}

export function useLogin() {
  const login = async (user: { email: string; passwd: string }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/authentication/login`, user);

      console.log("Login response:", response.data); // me dice que todo bien

      return { success: true, token: response.data.result.token };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}

export async function getExpensesSummary(token: string) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/expenses_summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.token)
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Error al obtener el resumen de gastos:", error);
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
      `${BACKEND_URL}/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    let errorMessage = "No se pudo obtener el detalle de gastos";
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

export async function addExpense(
  token: string,
  expense: {
    year: number;
    month: number;
    categoryId: number;
    amount: number;
    description: string;
  }
) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/expenses`,
      expense,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    let errorMessage = "No se pudo agregar el gasto";
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

export async function deleteExpense(token: string, expenseId: number) {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/expenses/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    let errorMessage = "No se pudo eliminar el gasto";
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getExpenseCategories(token: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/expenses_category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    let errorMessage = "No se pudieron obtener las categorías de gastos";
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

