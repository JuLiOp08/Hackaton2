import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToken } from '../contexts/TokenContext'; // Assuming TokenContext is in '../contexts/TokenContext'

interface ExpenseFormState {
  amount: number;
  year: number | null;
  month: number | null;
  expenseCategory: {
    id: number | null;
    name: string | null;
  };
}

interface Category {
  id: number;
  name: string;
}

interface FormDisplayState {
  date: string;
}

const AddExpense: React.FC = () => {
  const { token } = useToken(); // Get the token from context
  const [formData, setFormData] = useState<ExpenseFormState>({
    amount: 0,
    year: null,
    month: null,
    expenseCategory: {
      id: null,
      name: null,
    },
  });
  const [formDisplayState, setFormDisplayState] = useState<FormDisplayState>({
    date: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [addingExpense, setAddingExpense] = useState<boolean>(false);
  const [addExpenseError, setAddExpenseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/expenses', formData);
      console.log('Expense added successfully:', response.data);
      // Optionally, reset form or navigate
      setFormData({
        amount: 0,
        year: null,
        month: null,
        expenseCategory: {
          id: null,
          name: null,
        },
      });
      setFormDisplayState({ date: '' });
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
    setFormData({ ...formData, amount: parseFloat(e.target.value) });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      setFormData({
        ...formData,
        expenseCategory: {
          id: selectedCategory.id,
          name: selectedCategory.name,
        },
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setFormDisplayState({ date: dateValue });
    if (dateValue) {
      const [year, month] = dateValue.split('-').map(Number);
      setFormData({ ...formData, year, month });
    } else {
      setFormData({ ...formData, year: null, month: null });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('http://198.211.105.95:8080/expenses_category', {
          headers: { Authorization: `Bearer ${token}` } // Include token
        });
        setCategories(response.data);
      } catch (err: any) {
        setCategoriesError('Error fetching categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [token]); // Fetch categories when token changes

  return (
    <div>
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text" // This field is not in the expected backend structure, keeping for now or can remove
            id="description"
            name="description"
            value="" // Placeholder or remove if not needed
            onChange={() => {}} // Placeholder or remove if not needed
            disabled // Disable if not used by backend
          />
          <small>Note: Description is not stored by the backend as per API structure.</small>

        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleAmountChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoriesError ? (
            <p style={{ color: 'red' }}>{categoriesError}</p>
          ) : (
          <select
            id="category"
            name="category"
            value={formData.expenseCategory.id || ''}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formDisplayState.date}
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
