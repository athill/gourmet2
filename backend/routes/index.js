import express from 'express';
var router = express.Router();
import Exporter from '../export.js';

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
  const units = (await Recipe.sequelize.query(
    `SELECT DISTINCT unit
     FROM ingredients
     WHERE unit IS NOT NULL AND unit != ''
     ORDER BY unit ASC;`,
    { type: Recipe.sequelize.QueryTypes.SELECT }
  )).map(u => u.unit);
  res.json({ categories, cuisines, units });
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

router.get('/export', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({ include: 'ingredients' });
    const exporter = new Exporter(recipes);
    const xml = exporter.export();
    res.setHeader('Content-Disposition', 'attachment; filename="recipes.xml"');
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error exporting recipes:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findByPk(recipeId, { include: 'ingredients' });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.put('/recipes/:id', async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipeData = req.body;
    let recipe = await Recipe.findByPk(recipeId, { include: 'ingredients' });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    await recipe.update(recipeData);
    if (recipeData.ingredients) {
      await recipe.setIngredients([]); // Remove existing ingredients
      const Ingredient = Recipe.sequelize.models.Ingredient;
      for (const ingData of recipeData.ingredients) {
        const ingredient = await Ingredient.create({ ...ingData, recipeId: recipe.id });
        await recipe.addIngredient(ingredient);
      }
    }
    recipe = await Recipe.findByPk(recipeId, { include: 'ingredients' }); // Reload with ingredients
    res.json(recipe);
  } catch (error) {
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
