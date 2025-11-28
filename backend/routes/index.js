import express from 'express';
var router = express.Router();

import Recipe from '../models/Recipe.js';
import CategoriesView from '../models/CategoriesView.js';
import CuisinesView from '../models/CuisinesView.js';

/* GET home page. */
router.get('/', async (req, res, next) => {
  const recipes = await Recipe.findAll({ include: 'ingredients' })
  res.json(recipes);
});

router.get('/options', async (req, res, next) => {
  const categories = (await CategoriesView.findAll()).map(c => c.category);
  const cuisines = (await CuisinesView.findAll()).map(c => c.cuisine);
  res.json({ categories, cuisines });
});

router.post('/recipes', async (req, res, next) => {
  try {
    const recipeData = req.body;
    const recipe = await Recipe.create(recipeData, { include: 'ingredients' });
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.delete('/recipes/:id', async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    await recipe.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
