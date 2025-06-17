import { useState, type FormEvent } from "react";
import { useGetStudentById } from "../api";
import "../styles/App.css";

type Student = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  age: number;
  description: string;
};

export default function IdStudent() {
  const { getStudentById } = useGetStudentById();
  const [student, setStudent] = useState<Student | null>(null);
  const [studentId, setStudentId] = useState("");

  async function handleGetStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!studentId) {
      alert("Por favor, ingresa un ID de estudiante");
      return;
    }

    const result = await getStudentById(studentId);

    if (result.success) {
      setStudent(result.student);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        Obtener Estudiante por ID
      </h2>

      <form onSubmit={handleGetStudent} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="ID del Estudiante"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-600"
        >
          Obtener Estudiante
        </button>
      </form>

      {student && (
        <div className="mt-8 text-left text-gray-700">
          <h3 className="text-xl font-semibold mb-2">
            Detalles del Estudiante
          </h3>
          <p>
            <strong>Nombre:</strong> {student.firstname} {student.lastname}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {student.phone}
          </p>
          <p>
            <strong>Edad:</strong> {student.age}
          </p>
          <p>
            <strong>Descripción:</strong> {student.description}
          </p>
        </div>
      )}
    </div>
  );
}
