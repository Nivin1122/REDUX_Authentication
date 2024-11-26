import React, { useEffect } from 'react';
import './AdminHome.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers,deleteUser } from '../features/auth/usersSlice';
import { ACCESS_TOKEN } from '../Constants';

function Admin_Home() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      dispatch(fetchUsers(token));
    } else {
      alert('No access token found');
    }
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      alert('No access token found. Please login again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser({ userId, token }));
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
