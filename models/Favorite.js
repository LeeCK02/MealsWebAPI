const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  mealId: {
    type: String,
    required: true
  },
  mealName: {
    type: String,
    required: true
  },
  mealImage: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);