import React, { useState, useEffect } from "react";
import { getCategories, addExpense } from "../api";
import { useToken } from "../contexts/TokenContext";

const AddExpense: React.FC = () => {
  const { token } = useToken();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [addingExpense, setAddingExpense] = useState(false);
  const [addExpenseError, setAddExpenseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    categoryId: 0, // Cambia a number
    date: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        setAddExpenseError("Token no disponible.");
        return;
      }
      setLoadingCategories(true);
      const result = await getCategories(token);
      if (result.success) {
        setCategories(result.data);
      } else {
        setAddExpenseError("No se pudieron cargar las categorías.");
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddExpenseError(null);
    setSuccessMessage(null);
    setAddingExpense(true);

    if (!formData.categoryId || !formData.date || !formData.amount) {
      setAddExpenseError("Completa todos los campos.");
      setAddingExpense(false);
      return;
    }

    if (!token) {
      setAddExpenseError("No hay token de autenticación.");
      setAddingExpense(false);
      return;
    }

    // Construir el body correcto para el backend
    const expense = {
      amount: Number(formData.amount),
      category: { id: formData.categoryId },
      date: formData.date,
    };

    const result = await addExpense(token, expense);
    if (result.success) {
      setSuccessMessage("✅ Gasto agregado correctamente.");
      setFormData({ categoryId: 0, date: "", amount: "", description: "" });
    } else {
      setAddExpenseError(result.error || "Error al agregar el gasto.");
    }
    setAddingExpense(false);
  };

  return (
    <div className="flex justify-center bg-[#8B4C4C] min-h-screen py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg border border-[#cfa7a7]">
        <h2 className="text-2xl font-bold text-center text-[#8B4C4C] mb-6">Agregar Gasto</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-[#8B4C4C]" htmlFor="categoryId">
              Categoría:
            </label>
            {loadingCategories ? (
              <div className="text-gray-600">Cargando categorías...</div>
            ) : (
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] rounded px-4 py-2 focus:ring-2 focus:ring-[#8B4C4C]"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#8B4C4C]" htmlFor="date">
              Fecha:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] rounded px-4 py-2 focus:ring-2 focus:ring-[#8B4C4C]"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#8B4C4C]" htmlFor="amount">
              Monto:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] rounded px-4 py-2 focus:ring-2 focus:ring-[#8B4C4C]"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#8B4C4C]" htmlFor="description">
              Descripción:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] rounded px-4 py-2 focus:ring-2 focus:ring-[#8B4C4C]"
              placeholder="Opcional"
            />
          </div>

          <button
            type="submit"
            disabled={addingExpense}
            className="w-full bg-[#8B4C4C] text-gray rounded px-4 py-2 font-semibold hover:bg-[#a85d5d] transition-colors"
          >
            {addingExpense ? "Agregando..." : "Agregar Gasto"}
          </button>
        </form>

        {addExpenseError && <div className="text-red-600 mt-4 text-center">{addExpenseError}</div>}
        {successMessage && <div className="text-green-600 mt-4 text-center">{successMessage}</div>}
      </div>
    </div>
  );
};

export default AddExpense;
