import React, { useEffect, useState } from 'react';
import './AdminHome.css';
import { ACCESS_TOKEN } from '../Constants';

function Admin_Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN); // Get the access token
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/users/all-users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-home-container">
      <h2>All Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.username}</h3>
            <p>Email: {user.email || 'N/A'}</p>
            <p>ID: {user.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin_Home;
