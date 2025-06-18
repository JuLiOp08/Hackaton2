import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../api';

interface Goal {
  id: number;
  month: number;
  year: number;
  amount: number;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ month: '', year: '', amount: '' });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get<Goal[]>(`${BACKEND_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingGoal) {
      setEditingGoal({ ...editingGoal, [name]: value });
    } else {
      setNewGoal({ ...newGoal, [name]: value });
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<Goal>(`${BACKEND_URL}/goals`, newGoal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals([...goals, response.data]);
      setNewGoal({ month: '', year: '', amount: '' });
    } catch (error) {
      console.error('Error adding goal:', error);
      // Handle error
    }
  };

  const handleEditClick = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch<Goal>(`${BACKEND_URL}/goals/${editingGoal.id}`, editingGoal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(goals.map(goal => (goal.id === editingGoal.id ? response.data : goal)));
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Saving Goals</h2>

      {/* Add New Goal Form */}
      {!editingGoal && (
        <form onSubmit={handleAddGoal}>
          <h3>Add New Goal</h3>
          <div>
            <label htmlFor="month">Month:</label>
            <input
              type="number"
              id="month"
              name="month"
              value={newGoal.month}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={newGoal.year}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newGoal.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Goal</button>
        </form>
      )}

      {/* Edit Goal Form */}
      {editingGoal && (
        <form onSubmit={handleUpdateGoal}>
          <h3>Edit Goal</h3>
          <div>
            <label htmlFor="month">Month:</label>
            <input
              type="number"
              id="month"
              name="month"
              value={editingGoal.month}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={editingGoal.year}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={editingGoal.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Update Goal</button>
          <button type="button" onClick={() => setEditingGoal(null)}>Cancel</button>
        </form>
      )}

      {/* List of Goals */}
      <h3>Existing Goals</h3>
      <ul>
        {goals.map(goal => (
          <li key={goal.id}>
            Goal for {goal.month}/{goal.year}: {goal.amount}
            <button onClick={() => handleEditClick(goal)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;