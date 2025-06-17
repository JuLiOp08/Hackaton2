import { useState, type FormEvent } from "react";
import { deleteStudent } from "../api";
import "../styles/App.css";

export default function DeleteStudent() {
  const { deleteStudentById } = deleteStudent();
  const [studentId, setStudentId] = useState("");

  async function handleDeleteStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!studentId) {
      alert("Por favor, ingresa un ID de estudiante");
      return;
    }

    const result = await deleteStudentById(studentId);

    if (result.success) {
      alert("Estudiante eliminado exitosamente");
      setStudentId("");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        Eliminar Estudiante
      </h2>

      <form onSubmit={handleDeleteStudent} className="space-y-4">
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
          className="w-full px-4 py-2 bg-red-500 text-black text-lg rounded-md hover:bg-red-600"
        >
          Eliminar Estudiante
        </button>
      </form>
    </div>
  );
}