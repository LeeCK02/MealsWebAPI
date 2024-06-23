import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/favorites/${user.username}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFavorites(data);
          } else {
            setFavorites([]);
          }
        })
        .catch(err => {
          console.error('Error fetching favorites:', err);
          setFavorites([]);
        });
    }
  }, [user]);

  const deleteFavorite = (id) => {
    fetch(`http://localhost:5000/favorites/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        setFavorites(favorites.filter(meal => meal._id !== id));
        setMessage('Meal removed from favorites successfully');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      })
      .catch(err => console.error('Error deleting favorite:', err));
  };

  return (
    <div className="favorites">
      <h2>Favorite Meals</h2>
      {message && <div className="message">{message}</div>}
      <div className="meal-grid">
        {favorites.length > 0 ? (
          favorites.map(meal => (
            <div key={meal._id} className="meal-item">
              <img src={meal.mealImage} alt={meal.mealName} />
              <h3>{meal.mealName}</h3>
              <button className="delete-from-favorites" onClick={() => deleteFavorite(meal._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No favorite meals found.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
