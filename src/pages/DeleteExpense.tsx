import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../api';
import { useToken } from '../contexts/TokenContext';

interface Expense {
  id: number;
  expenseCategory: {
    id: number;
    name: string;
  };
  year: number;
  month: number;
  amount: number;
}

const DeleteExpense: React.FC = () => {
  const { token } = useToken();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) {
        setError("Token no disponible");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("TOKEN ENVIADO:", token);
        const response = await axios.get(`${BACKEND_URL}/expenses`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching expenses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  const handleDelete = async () => {
    if (!selectedExpenseId) {
      alert('Please select an expense to delete.');
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/expenses/${selectedExpenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter(exp => exp.id !== selectedExpenseId));
      setSelectedExpenseId(null);
    } catch (err) {
      setError('Error deleting expense.');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-[#8B4C4C]">Eliminar Gasto</h2>
      {expenses.length === 0 ? (
        <p>No se encontraron gastos.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map(expense => (
            <li
              key={expense.id}
              className={`p-3 border rounded flex justify-between items-center ${
                selectedExpenseId === expense.id ? 'bg-[#fce9e9]' : ''
              }`}
            >
              <span>
                S/ {expense.amount.toFixed(2)} – {expense.month}/{expense.year} –{' '}
                {expense.expenseCategory.name}
              </span>
              <button
                onClick={() => setSelectedExpenseId(expense.id)}
                className="ml-4 text-sm text-[#8B4C4C] hover:underline"
              >
                {selectedExpenseId === expense.id ? 'Seleccionado' : 'Seleccionar'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleDelete}
        disabled={!selectedExpenseId}
        className={`mt-6 w-full bg-[#8B4C4C] text-white py-2 px-4 rounded hover:bg-[#a85d5d] transition ${
          !selectedExpenseId ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Eliminar gasto seleccionado
      </button>
    </div>
  );
};

export default DeleteExpense;
