import { useState, type FormEvent } from "react";
import { useSignup } from "../api";
import { useNavigate } from "react-router";

export default function Signup() {
  const { register } = useSignup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await register({ email, password, firstname, role });

    if (password.length < 12) {
      alert("La contraseña debe tener al menos 12 caracteres");
      return;
    }

    if (result.success) {
      alert("Usuario registrado exitosamente");
      setEmail("");
      setPassword("");
      setFirstname("");
      setRole("USER");
      navigate("/");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Registro
      </h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Nombre"
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <button
          className="w-full bg-blue-600 text-black py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          type="submit"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
