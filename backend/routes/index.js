import express from 'express';
var router = express.Router();
import Exporter from '../export.js';
import { writeFile } from 'fs';

import Ingredient from '../models/Ingredient.js';
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
  const yieldsUnits = (await Recipe.sequelize.query(
    `SELECT DISTINCT yields_unit
     FROM recipes
     WHERE yields_unit IS NOT NULL AND yields_unit != ''
     ORDER BY yields_unit ASC;`,
    { type: Recipe.sequelize.QueryTypes.SELECT }
  )).map(u => u.yields_unit);
  res.json({ categories, cuisines, units, yieldsUnits });
});

router.post('/recipes', async (req, res, next) => {
  let recipe
  const recipeData = req.body;
  try {
    recipe = await Recipe.create(recipeData);
    console.log('Created recipe:', recipe.id, recipe.title);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(error.status || 500).json({ error: error.message });
    return;
  }
  try {
    await addIngredients(recipeData, recipe.id);
  } catch (error) {
    console.error('Error adding ingredients:', error);
    res.status(error.status || 500).json({ error: error.message });
    return;
  }
  await exportXml();
  res.status(201).json(recipe);

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
  const recipeId = req.params.id;
  const recipeData = req.body;
  let recipe = await Recipe.findByPk(recipeId);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  console.log('Updating recipe:', recipeId, recipeData);
  await updateRecipeAndIngredients(recipeId, recipeData);
  await exportXml();
  try {
    recipe = await Recipe.findByPk(recipeId, { include: 'ingredients' }); // Reload with ingredients
    res.json(recipe);
  } catch (error) {
    res.status(error.status || 500).json({ error: `Error reloading recipe: ${error.message}` });
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

async function updateRecipeAndIngredients(recipeId, recipeData) {
  try {
    // 1. Find the user with their profile
    const recipe = await Recipe.findOne({
      where: { id: recipeId },
      include: 'ingredients',
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // 2. Update the user model
    await recipe.update(recipeData);

    // 3. Update the associated ingredient model
    // Remove existing ingredients
    const existingIngredients = await recipe.getIngredients();
    for (const ing of existingIngredients) {
      await ing.destroy();
    }

    console.log('Existing ingredients removed.');
    console.log('Adding new ingredients:', recipeData.ingredients);
    // Add new ingredients
    await addIngredients(recipeData, recipeId);

  } catch (error) {
    // If any step fails, roll back the transaction
    console.error('Update failed', error);
  }
}

const addIngredients = async (recipeData, recipeId) => {
  if (recipeData.ingredients) {
    recipeData.ingredients.forEach(async (ingredient) => {
      console.log('Adding ingredient:', ingredient);
      try {
        await Ingredient.create({
          ...ingredient,
          recipeId,
          key: ingredient.key || ingredient.item.split(';')[0]
        });
      } catch (error) {
        console.error('Error adding ingredient:', error);
        throw error;
      }
    });
  }
}

const exportXml = async () => {
  const recipes = await Recipe.findAll({ include: 'ingredients' });
  const exporter = new Exporter(recipes);
  const xml = exporter.export();
  writeFile(process.env.RECIPES_XML, xml, (err) => {
    if (err) {
      console.error('Error writing XML file:', err);
    } else {
      console.log(`Recipes exported to ${process.env.RECIPES_XML}`);
    }
  })
};

export default router;
