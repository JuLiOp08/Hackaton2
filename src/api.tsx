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
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, user);
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
      const response = await axios.post(`${BACKEND_URL}/auth/login`, user);
      return { success: true, token: response.data.token };
    } catch {
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}

type Student = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  age: number;
  description: string;
  password: string;
};

export function useCreateStudent() {
  const { token } = useToken();

  const createStudent = async (student: Student) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/student`, student, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, student: response.data };
    } catch {
      return { success: false, error: "Error al crear el estudiante" };
    }
  };

  return { createStudent };
}

export function useGetAllStudents() {
  const { token } = useToken();
  const getAllStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, students: response.data };
    } catch {
      return { success: false, error: "Error al obtener los estudiantes" };
    }
  };
  return { getAllStudents };
}

export function useGetStudentById() {
  const { token } = useToken();
  const getStudentById = async (id: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, student: response.data };
    } catch {
      return { success: false, error: "Error al obtener el estudiante" };
    }
  };
  return { getStudentById };
}

export function deleteStudent() {
  const { token } = useToken();
  const deleteStudentById = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true };
    } catch {
      return { success: false, error: "Error al eliminar el estudiante" };
    }
  };
  return { deleteStudentById };
}
