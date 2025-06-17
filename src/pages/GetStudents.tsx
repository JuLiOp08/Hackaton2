import { useState, type FormEvent } from "react";
import { useGetAllStudents } from "../api";
import { useNavigate } from "react-router";
import "../styles/App.css";

type Student = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  age: number;
  description: string;
};

function GetStudents() {
  const navigate = useNavigate();
  const { getAllStudents } = useGetAllStudents();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  async function handleGetStudents(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await getAllStudents();

    if (result.success) {
      setStudents(result.students);
      setCurrentIndex(0);
    } else {
      alert(result.error);
    }
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, students.length - 1));
  }

  function handlePrev() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }

  const currentStudent = students[currentIndex];

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-black ">
        Obtener Estudiantes
      </h2>

      <form onSubmit={handleGetStudents} className="space-y-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-600"
        >
          Obtener Estudiantes
        </button>
      </form>

      {currentStudent && (
        <div className="mt-8 text-left text-gray-700">
          <h3 className="text-xl font-semibold mb-2">
            Estudiante {currentIndex + 1} de {students.length}
          </h3>
          <p>
            <strong>Nombre:</strong> {currentStudent.firstname}{" "}
            {currentStudent.lastname}
          </p>
          <p>
            <strong>Email:</strong> {currentStudent.email}
          </p>
          <p>
            <strong>Edad:</strong> {currentStudent.age}
          </p>
          <p>
            <strong>Teléfono:</strong> {currentStudent.phone}
          </p>
          <p>
            <strong>Descripción:</strong> {currentStudent.description}
          </p>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-black rounded hover:bg-grey-400 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === students.length - 1}
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-full max-w-xs bg-blue-600 text-black py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
              onClick={() => navigate("/student/id")}
              type="button"
            >
              Found Student by ID
            </button>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-full max-w-xs bg-blue-600 text-black py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
              onClick={() => navigate("/student/delete")}
              type="button"
            >
              Delete Student
            </button>
          </div>
        </div>
      )}

      {students.length === 0 && (
        <div className="mt-6 text-center text-gray-500">
          No hay estudiantes para mostrar.
        </div>
      )}
    </div>
  );
}

export default GetStudents;
