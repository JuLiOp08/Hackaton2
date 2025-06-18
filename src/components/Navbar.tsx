import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-gray-100 shadow px-8 py-6 flex gap-8 items-center justify-center fixed top-0 left-0 z-50">
      <span className="text-3xl font-bold text-black mr-8 justify-start">Ahorrista Web App</span>
      <Link to="/" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Login</Link>
      <Link to="/signup" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Registro</Link>
      <Link to="/expenses_summary" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Expenses_Sumary</Link>
      <Link to="/expenses_detail" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Expenses_Detail</Link>

    </nav>
  );
}

export default Navbar;