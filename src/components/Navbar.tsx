import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-gray-100 shadow px-8 py-6 flex gap-8 items-center justify-center fixed top-0 left-0 z-50">
      <span className="text-3xl font-bold text-black mr-8">Ahorrista Web App</span>
      <Link to="/" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Login</Link>
      <Link to="/signup" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Registro</Link>
      <Link to="/expenses-summary" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Resumen de Gastos</Link>
      <Link to="/add-expense" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Agregar Gasto</Link>
      <Link to="/delete-expense" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Eliminar Gasto</Link>
      <Link to="/expenses_category" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Categorías</Link>
    </nav>
  );
}

export default Navbar;