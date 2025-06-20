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
    categoryId: "",
    date: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      setLoadingCategories(true);
      const result = await getCategories(token);
      if (result.success) {
        setCategories(result.data);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddExpenseError(null);
    setSuccessMessage(null);
    setAddingExpense(true);

    // Validación simple
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

    // Parsear año y mes de la fecha
    const [year, month] = formData.date.split("-");
    const expense = {
      year: Number(year),
      month: Number(month),
      categoryId: Number(formData.categoryId),
      amount: Number(formData.amount),
      description: formData.description,
    };

    const result = await addExpense(token, expense);
    if (result.success) {
      setSuccessMessage("Gasto agregado correctamente.");
      setFormData({
        categoryId: "",
        date: "",
        amount: "",
        description: "",
      });
    } else {
      setAddExpenseError(result.error || "Error al agregar el gasto.");
    }
    setAddingExpense(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[#8B4C4C]">Agregar Gasto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryId">Categoría:</label>
          {loadingCategories ? (
            <div>Cargando categorías...</div>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="amount">Monto:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          disabled={addingExpense}
          className="bg-[#8B4C4C] text-black px-4 py-2 rounded hover:bg-[#a85d5d]"
        >
          {addingExpense ? "Agregando..." : "Agregar Gasto"}
        </button>
      </form>
      {addExpenseError && <div className="text-red-600 mt-2">{addExpenseError}</div>}
      {successMessage && <div className="text-green-600 mt-2">{successMessage}</div>}
    </div>
  );
};

export default AddExpense;
