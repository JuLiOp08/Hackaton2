import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../api';
import { useToken } from '../contexts/TokenContext';

interface ExpenseFormState {
  amount: number | null;
  category: { id: number | null };
  date: string;
}

interface Category {
  id: number;
  name: string;
}

const AddExpense: React.FC = () => {
  const { token } = useToken();
  const [formData, setFormData] = useState<ExpenseFormState>({
    amount: 0,
    category: { id: null },
    date: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [addExpenseError, setAddExpenseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setAddingExpense(true);
      setAddExpenseError(null);
      setSuccessMessage(null);

      await axios.post(`${BACKEND_URL}/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData({
        amount: 0,
        category: { id: null },
        date: '',
      });

      setSuccessMessage('Expense added successfully!');
    } catch (error: any) {
      console.error('Error adding expense:', error);
      if (error.response) {
        setAddExpenseError(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        setAddExpenseError('Error: No response from server.');
      } else {
        setAddExpenseError('Error: Could not send request.');
      }
    } finally {
      setAddingExpense(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setFormData({ ...formData, amount: isNaN(amount) ? null : amount });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setFormData({ ...formData, category: { id: categoryId } });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setAddExpenseError(null);
      try {
        const response = await axios.get<Category[]>(`${BACKEND_URL}/expenses_category`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (err) {
        setAddExpenseError('Error fetching categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [token]);

  return (
    <div>
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount ?? ''}
            onChange={handleAmountChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category.id ?? ''}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            required
          />
        </div>

        <button type="submit" disabled={addingExpense}>
          {addingExpense ? 'Adding Expense...' : 'Add Expense'}
        </button>
      </form>

      {addExpenseError && <p style={{ color: 'red' }}>{addExpenseError}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddExpense;
