import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // eslint-disable-next-line
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ username }));
        setUser({ username });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (newUsername, newPassword) => {
    // Update profile logic
    // Example: Assuming you have a backend API to update user profile
    fetch('/api/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    })
      .then(response => {
        if (response.ok) {
          // Handle successful profile update
          setUser({ ...user, username: newUsername }); // Update user context if needed
        } else {
          // Handle error in profile update
          console.error('Failed to update profile');
        }
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

