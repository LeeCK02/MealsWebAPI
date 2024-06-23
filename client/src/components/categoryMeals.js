import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import './categoryMeals.css';
import { AuthContext } from '../AuthContext';

const CategoryMeals = () => {
  const [meals, setMeals] = useState([]);
  const { category } = useParams();
  const { user } = useContext(AuthContext); // Access user state from AuthContext

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          setMeals(data.meals);
        }
      })
      .catch(err => console.error(err));
  }, [category]);

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
    <div className="category-meals">
      <h2>{category} Meals</h2>
      <div className="meal-grid">
        {meals.map(meal => (
          <div key={meal.idMeal} className="meal-item">
            <Link to={`/meal/${meal.idMeal}`} className="meal-link">
              <img src={meal.strMealThumb} alt={meal.strMeal} width="100" />
              <h3>{meal.strMeal}</h3>
            </Link>
            <button
              className="add-to-favorites"
              onClick={() => addToFavorites(meal.idMeal, meal.strMeal, meal.strMealThumb)}
            >
              Add to Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMeals;
