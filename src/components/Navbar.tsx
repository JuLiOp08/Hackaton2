import { Link } from "react-router-dom";

function Navbar() {
  return (
     <nav className="w-full bg-gray-100 shadow px-8 py-6 flex gap-8 items-center justify-center fixed top-0 left-0 z-50">
      <span className="text-3xl font-bold text-black mr-8 justify-start">Ahorrista Web App</span>
      <Link to="/" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Login</Link>
      <Link to="/signup" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Signup</Link>
      <Link to="/summary" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Expenses Summary</Link>
      <Link to="/expenses/:id" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Expenses Detail</Link>      
      <Link to="/expense-categories" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Categories</Link>
      <Link to="/add-expense" className="px-3 py-1 rounded hover:bg-gray-300 font-semibold">Add Expense</Link>

    </nav>
  );
}

export default Navbar;