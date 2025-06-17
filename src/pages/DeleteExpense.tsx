import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const DeleteExpense: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/expenses');
        setExpenses(response.data);
      } catch (err) {
        setError('Error fetching expenses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async () => {
    if (!selectedExpenseId) {
      alert('Please select an expense to delete.');
      return;
    }

    try {
      await axios.delete(`/expenses/${selectedExpenseId}`);
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
    <div>
      <h2>Delete Expense</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map(expense => (
            <li key={expense.id}>
              {expense.description} - ${expense.amount.toFixed(2)} - {expense.date}
              <button onClick={() => setSelectedExpenseId(expense.id)}>
                {selectedExpenseId === expense.id ? 'Selected' : 'Select'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleDelete} disabled={!selectedExpenseId}>
        Delete Selected Expense
      </button>
    </div>
  );
};

export default DeleteExpense;