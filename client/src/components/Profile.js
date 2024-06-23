import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Assuming you have an AuthContext
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext); // Assuming user context provides `_id`, `username`, and `email`
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate current password
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username, password: currentPassword }),
      });
      
      // eslint-disable-next-line
      const data = await response.json();
  
      if (!response.ok) {
        setPasswordError('Current password is incorrect');
        return;
      }
    } catch (error) {
      console.error('Error validating current password:', error);
      setPasswordError('Failed to validate current password');
      return;
    }
  
    // Validate passwords
    if (newPassword === user.password) {
      setPasswordError('New password cannot be the same as current password');
      return;
    }
  
    // Validate new password
    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as current password');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
  
    // Proceed to update profile
    try {
      const updateResponse = await fetch(`http://localhost:5000/profile/${user.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
  
      const updateData = await updateResponse.json();
  
      if (updateResponse.ok) {
        // Update user context if needed
        updateProfile(user.username, newPassword);
        alert('Profile updated successfully');
      } else {
        if (updateData.errors) {
          setErrors(updateData.errors);
        } else {
          setErrors([{ msg: 'Failed to update profile' }]);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={user.username}
            readOnly // Make the input read-only
          />
        </div>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button type="submit">Update Profile</button>
      </form>
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index} className="error-message">{error.msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
