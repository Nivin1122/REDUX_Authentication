import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import "../components/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === "login") {
      dispatch(loginUser({ username, password }))
        .unwrap()
        .then(() => navigate("/"))
        .catch((err) => alert(err));
    } else {
      dispatch(registerUser({ username, password }))
        .unwrap()
        .then(() => navigate("/login"))
        .catch((err) => alert(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <h1>{name}</h1>
      <input
        className='form-input'
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username'
      />
      <input
        className='form-input'
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      <button className='form-button' type='submit' disabled={loading}>
        {loading ? "Loading..." : name}
      </button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default Form;
