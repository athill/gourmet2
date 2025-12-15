


export const units = {
  lb: ['pounds', 'lb', 'lb.', 'lbs', 'pound', 'Pound', 'lbs.', 'Lb.', 'Pounds', 'Lb', 'Lbs'],
  oz: ['ounces', 'oz', 'oz.', 'ounce', 'Ounce', 'Oz.', 'Ounces', 'Oz'],
  tsp: ['teaspoons', 'tsp', 'tsp.', 'teaspoon', 'Teaspoon', 'Tsp.', 'Teaspoons', 'Tsp'],
  tbsp: ['tablespoons', 'tbsp', 'tbsp.', 'tablespoon', 'Tablespoon', 'Tbsp.', 'Tablespoons', 'Tbsp'],
  cup: ['cups', 'cup', 'Cup', 'Cups'],
  pint: ['pints', 'pint', 'Pint', 'Pints'],
  quart: ['quarts', 'quart', 'Quart', 'Quarts'],
  gallon: ['gallons', 'gallon', 'Gallon', 'Gallons'],
  ml: ['milliliters', 'milliliter', 'Milliliter', 'Milliliters', 'mls', 'mL', 'mLs'],
  L: ['liters', 'liter', 'Liter', 'Liters', 'ls', 'L', 'Ls'],
  g: ['grams', 'gram', 'Gram', 'Grams'],
  kg: ['kilograms', 'kilogram', 'Kilogram', 'Kilograms'],
  can: ['cans', 'can', 'Can', 'Cans'],
  package: ['packages', 'package', 'Package', 'Packages'],
  slice: ['slices', 'slice', 'Slice', 'Slices'],
  piece: ['pieces', 'piece', 'Piece', 'Pieces'],
  clove: ['cloves', 'clove', 'Clove', 'Cloves'],
  stalk: ['stalks', 'stalk', 'Stalk', 'Stalks'],
  dash: ['dashes', 'dash', 'Dash', 'Dashes'],
}

export const normalizeUnit = (inputUnit) => {
  if (!inputUnit) return null;
  const lowerInput = inputUnit.toLowerCase();
  for (const [standardUnit, variants] of Object.entries(units)) {
    if (variants.map(v => v.toLowerCase()).includes(lowerInput)) {
      return standardUnit;
    }
  }
  return inputUnit; // return as-is if no match found
}

