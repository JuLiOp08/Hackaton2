import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-gray-100 shadow px-8 py-6 flex gap-8 items-center justify-center fixed top-0 left-0 z-50">
      <span className="text-3xl font-bold text-black mr-8 justify-start">STUDENTS</span>
      <Link to="/" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Login</Link>
      <Link to="/signup" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Registro</Link>
      <Link to="/student_form" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Crear Estudiante</Link>
    </nav>
  );
}

export default Navbar;