import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Register.css';

const Register = () => {
  const { login } = useContext(AuthContext); // Assuming AuthContext provides a login function
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming login function sets the user in AuthContext upon successful registration
        await login(username, password); // Modify according to your AuthContext implementation
        navigate('/profile'); // Navigate to profile or dashboard after registration
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors([{ msg: 'Registration failed. Please try again later.' }]);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index} style={{ color: 'red' }}>{error.msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Register;
