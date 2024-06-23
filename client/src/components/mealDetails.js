import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './mealDetails.css';
import { AuthContext } from '../AuthContext';

const MealDetails = () => {
  const [meal, setMeal] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext); // Access user state from AuthContext

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          setMeal(data.meals[0]);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const addToFavorites = (mealId, mealName, mealImage) => {
    if (!user) {
      alert('Please log in to add this meal to favorites.');
      return;
    }

    fetch(`http://localhost:5000/favorites/${user.username}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch user favorites');
        }
        return res.json();
      })
      .then(favorites => {
        const isAlreadyFavorite = favorites.some(favorite => favorite.mealId === mealId);

        if (isAlreadyFavorite) {
          alert('This meal is already in your favorites.');
          return;
        }

        fetch('http://localhost:5000/addFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mealId,
            mealName,
            mealImage,
            username: user.username
          })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to add meal to favorites');
          }
          return res.json();
        })
        .then(data => {
          alert(data.msg);
          // Optionally update UI to reflect added meal to favorites
          // Possibly update the meal details UI, though it depends on your application flow
        })
        .catch(err => {
          console.error('Error adding to favorites:', err);
          alert('Failed to add meal to favorites. Please try again later.');
        });
      })
      .catch(err => {
        console.error('Error fetching favorites:', err);
        alert('Failed to fetch user favorites. Please try again later.');
      });
  };

  return (
    <div className="meal-details">
      {meal ? (
        <div>
          <h2>{meal.strMeal}</h2>
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <p><strong>Category:</strong> {meal.strCategory}</p>
          <p><strong>Area:</strong> {meal.strArea}</p>
          <p><strong>Instructions:</strong></p>
          <p>{meal.strInstructions}</p>
          <button
            className="add-to-favorites"
            onClick={() => addToFavorites(meal.idMeal, meal.strMeal, meal.strMealThumb)}
          >
            Add to Favorites
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MealDetails;
