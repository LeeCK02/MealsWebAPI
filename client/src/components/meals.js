import React, { Component} from 'react';
import './meals.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

class Meals extends Component {

  static contextType = AuthContext;

  constructor() {
    super();
    this.state = {
      meals: [],
      searchTerm: '',
      loggedInUser: null  // To store the logged-in user
    };
  }

  componentDidMount() {
    this.fetchMeals();
  }

  fetchMeals() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const mealPromises = letters.map(letter =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(res => res.json())
    );

    Promise.all(mealPromises).then(results => {
      const allMeals = results.reduce((acc, result) => {
        if (result.meals) {
          acc = acc.concat(result.meals);
        }
        return acc;
      }, []);
      this.setState({ meals: allMeals }, () => console.log('Meals fetched...', allMeals));
    }).catch(err => console.error(err));
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  filterMeals() {
    const { meals, searchTerm } = this.state;
    return meals.filter(meal =>
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  addToFavorites = (mealId, mealName, mealImage) => {
    const { user } = this.context;
  
    if (!user) {
      alert('Please log in to add this meal to favorites.');
      return;
    }
  
    const { username } = user;
  
    // Fetch user's favorites from the database
    fetch(`http://localhost:5000/favorites/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user favorites');
        }
        return res.json();
      })
      .then((favorites) => {
        // Check if meal already exists in favorites
        const isAlreadyFavorite = favorites.some(
          (favorite) => favorite.mealId === mealId
        );
  
        if (isAlreadyFavorite) {
          alert('This meal is already in your favorites.');
          return;
        }
  
        // Send request to backend to add to favorites
        fetch('http://localhost:5000/addFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mealId,
            mealName,
            mealImage,
            username,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Failed to add meal to favorites');
            }
            return res.json();
          })
          .then((data) => {
            alert(data.msg); // Show success message
            // Optionally update UI to reflect added meal to favorites
            this.fetchMeals(); // Fetch meals again to reflect updates
          })
          .catch((err) => {
            console.error('Error adding to favorites:', err);
            alert('Failed to add meal to favorites. Please try again later.');
          });
      })
      .catch((err) => {
        console.error('Error fetching favorites:', err);
        alert('Failed to fetch user favorites. Please try again later.');
      });
  };

  render() {
    const filteredMeals = this.filterMeals();

    return (
      <div>
        <h2 className="meals-heading">All Meals</h2>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search for a meal..." 
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
            className="search-bar"
          />
        </div>
        <div className="meal-grid">
          {filteredMeals.map(meal => (
            <div key={meal.idMeal} className="meal-item">
              <Link to={`/meal/${meal.idMeal}`}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <h3>{meal.strMeal}</h3>
              </Link>
              <button 
                className="add-to-favorites"
                onClick={() => this.addToFavorites(meal.idMeal, meal.strMeal, meal.strMealThumb)}
              >
                Add to Favorites
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Meals;