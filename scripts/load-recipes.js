import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import Recipe from '../backend/models/Recipe.js';

const __dirname = path.resolve();

const file = path.join(__dirname, 'backend', 'recipes.xml')

const rawData = fs.readFileSync(file)

const parser = new XMLParser({ ignoreAttributes: false  });
let jObj = parser.parse(rawData);

// console.log('Parsed XML data:', jObj.gourmetDoc.recipe.filter((r) => r.title === 'Frittata')[0]['ingredient-list']);
// process.exit(0);

// .slice(0,2))

const recipes = jObj.gourmetDoc.recipe.map((r) => {
  const recipe = {...r};
  recipe.ingredients = r['ingredient-list'].ingredient;
  delete recipe['ingredient-list'];
  return recipe;
});

// console.log(recipes.find(r => r.title === 'Onion Powder'));
// process.exit(0);

recipes.forEach(async (recipeData) => {
  const data = {...recipeData};
  // 5/5 stars -> 5
  data.rating = data.rating && data.rating.split('/')[0];
  // yields: "4 servings" -> yieldsQuantity: 4, yieldsUnit: "servings"
  // console.log('Parsing yields:', data.yields, data.title);
  if (data.yields) {

    const yieldsRegex = /(\d+)(\.\d+)?\s*(\d+\/\d+)?\s*(.*)/;
    const match = String(data.yields).match(yieldsRegex);
    // match = data.yields.match(yieldsRegex);
    if (match) {
      const [ , integer, decimal, fraction, yieldsUnit] = match;
      if (fraction) {
        const [num, denom] = fraction.split('/').map(Number);
        const quotient = Math.round((num / denom) * 100) / 100;
        data.yieldsQuantity = parseFloat(integer || 0) + parseFloat(decimal || 0) + quotient;
      } else {
        data.yieldsQuantity = parseFloat(integer + (decimal || ''));
      }
      data.yieldsUnit = yieldsUnit;
      delete data.yields;
      // console.log('Parsed yields:', data.yieldsQuantity, data.yieldsUnit);
    }
  }
  if (data.image) {
    data.imageType = data.image['@_format'];
    data.image = data.image && Buffer.from(data.image['#text'], 'base64');
  }
  // console.log(data.title, data.ingredients);
  if (!Array.isArray(data.ingredients)) {
    data.ingredients = [data.ingredients];
  }

  data.ingredients = data.ingredients.map((ing) => {
    const ingredient = {...ing};
    ingredient.optional = ingredient['@_optional'] === 'true';
    delete ingredient['@_optional'];
    return ingredient;
  });

  // console.log(data);

  try {
    await fetch('http://localhost:4242/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log(`Inserted recipe: ${recipeData.title}`);
  } catch (error) {
    console.error(`Error inserting recipe: ${recipeData.title}`, error);
  }
});

// console.log('Transformed recipe data:', recipes.slice(0,2));

