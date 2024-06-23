const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./connect');
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route for user login
app.post(
  '/login',
  async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      res.status(200).json({ msg: 'Login successful' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route for updating profile
app.put('/profile/:username', async (req, res) => {
  const { newPassword } = req.body;
  const { username } = req.params;

  try {
    // Find user by username
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // Check if new password is different from current password
    if (newPassword === user.password) {
      return res.status(400).json({ errors: [{ msg: 'New password cannot be the same as current password' }] });
    }

    // Update user data
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updated user
    await user.save();

    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).send('Server error');
  }
});

// Route to add a favorite meal
app.post('/addFavorite', async (req, res) => {
  const { mealId, mealName, mealImage, username } = req.body;

  try {
    const favorite = new Favorite({
      mealId,
      mealName,
      mealImage,
      username,
    });

    await favorite.save();
    res.status(200).json({ msg: 'Meal added to favorites successfully' });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).send('Server error');
  }
});

// Route to get all favorite meals for a specific user
app.get('/favorites/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const favorites = await Favorite.find({ username });
    res.status(200).json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).send('Server error');
  }
});

// Route to delete a favorite meal
app.delete('/favorites/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Favorite.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Meal removed from favorites successfully' });
  } catch (err) {
    console.error('Error deleting favorite:', err.message);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
