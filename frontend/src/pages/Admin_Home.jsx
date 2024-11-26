import React, { useEffect, useState } from 'react';
import './AdminHome.css';
import { ACCESS_TOKEN } from '../Constants';

function Admin_Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError('No access token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users/all-users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error fetching users');
      }
    } catch (error) {
      setError('Network error while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      alert('No access token found. Please login again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/delete-user/${userId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete user');
        }
      } catch (error) {
        alert('Network error while deleting user');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-home-container">
      <h2>All Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.username}</h3>
            <p>Email: {user.email || 'N/A'}</p>
            <p>ID: {user.id}</p>
            <button 
              onClick={() => handleDeleteUser(user.id)}
              className="delete-button"
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin_Home;