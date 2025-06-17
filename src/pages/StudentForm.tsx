import { type FormEvent } from "react";
import { useCreateStudent } from "../api";
import { useNavigate } from "react-router";
import "../styles/App.css";

function StudentForm() {
  const { createStudent } = useCreateStudent();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const alumno = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      age: parseInt(formData.get("age") as string),
      description: formData.get("description") as string,
      password: formData.get("password") as string,
    };

    const result = await createStudent(alumno);

    if (result.success) {
      console.log(result.student);
      alert("Estudiante creado exitosamente");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Crear Estudiante
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Nombre"
          type="text"
          name="firstname"
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Apellido"
          type="text"
          name="lastname"
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Email"
          type="email"
          name="email"
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Teléfono"
          type="tel"
          name="phone"
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Edad"
          type="number"
          name="age"
          min="1"
          max="120"
          required
        />
        <textarea
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 resize-vertical"
          placeholder="Descripción"
          name="description"
          rows={3}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          placeholder="Contraseña"
          type="password"
          name="password"
          required
        />
        <button
          className="w-full bg-green-600 text-black py-3 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
          type="submit"
        >
          Crear Estudiante
        </button>
        <button
          className="mb-6 w-full bg-blue-600 text-black py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          onClick={() => navigate("/get_students")}
          type="button"
        >
          Ver Estudiantes
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
