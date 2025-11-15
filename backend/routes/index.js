import express from 'express';
var router = express.Router();

import Recipe from '../models/Recipe.js';

/* GET home page. */
router.get('/', async (req, res, next) => {
  const recipes = await Recipe.findAll({ include: 'ingredients' })
  res.json(recipes);
});

router.post('/recipes', async (req, res, next) => {
  try {
    const recipeData = req.body;
    const recipe = await Recipe.create(recipeData, { include: 'ingredients' });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
