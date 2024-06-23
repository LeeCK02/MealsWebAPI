import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Meals from './components/meals';
import MealDetails from './components/mealDetails';
import CategoryMeals from './components/categoryMeals';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import { AuthProvider, AuthContext } from './AuthContext';
import PrivateRoute from './PrivateRoute';  // Ensure this import is correct
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Meal Finder</h1>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/category/Chicken">Chicken</Link>
              <Link to="/category/Beef">Beef</Link>
              <Link to="/category/Seafood">Seafood</Link>
              <Link to="/category/Pork">Pork</Link>
              <AuthLinks />
            </nav>
          </header>
          <Routes> {/* Ensure all routes are inside Routes */}
            <Route path="/" element={<Meals />} />
            <Route path="/meal/:id" element={<MealDetails />} />
            <Route path="/category/:category" element={<CategoryMeals />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} /> {/* Use PrivateRoute */}
            <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} /> {/* Use PrivateRoute */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthLinks = () => {
  const { user, logout } = useContext(AuthContext);

  return user ? (
    <React.Fragment>
      <Link to="/favorites">Favorites</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={logout} className="logout-button">Logout</button>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
