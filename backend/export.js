import { encode } from 'html-entities'

class Exporter {
  indent = 0;

  constructor(recipes = []) {
    this.recipes = recipes;
  }

  otag(tag, attrs = {}) {
    const attrString = this.attrsToString(attrs);
    const retVal = this.output(`<${tag}${attrString}>`);
    this.indent += 1;
    return retVal;
  }

  ctag(tag) {
    this.indent -= 1;
    const retVal = this.output(`</${tag}>`);
    return retVal;
  }

  tag(tag, content, attrs = {}) {
    const attrString = this.attrsToString(attrs);
    return `${this.otag(tag, attrs)}${this.content(content)}${this.ctag(tag)}`;
  }

  attrsToString(attrs) {
    return Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`).join('');
  }

  content(string) {
    return this.output(encode(string));
  }

  output(string) {
    // console.log('Outputting string:', string, this.indent);
    return '\t'.repeat(this.indent) + string + '\n';
  }

  export() {
    this.indent = 0;
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += this.otag('gourmetDoc');
    xml += this.otag('recipe-list');
    this.recipes.forEach((recipe) => {
      xml += this.otag('recipe', { id: recipe.id });
      xml += this.tag('title', recipe.title);
      xml += this.tag('category', recipe.category);
      if (recipe.cuisine) {
        xml += this.tag('cuisine', recipe.cuisine);
      }
      if (recipe.link) {
        xml += this.tag('link', recipe.link);
      }
      if (recipe.rating) {
        xml += this.tag('rating', `${recipe.rating}/5 stars`);
      }
      if (recipe.preptime) {
        xml += this.tag('preptime', recipe.preptime);
      }
      if (recipe.cooktime) {
        xml += this.tag('cooktime', recipe.cooktime);
      }
      if (recipe.yieldsQuantity) {
        const yieldsUnit = recipe.yieldsUnit || '';
        xml += this.tag('yields', `${recipe.yieldsQuantity} ${yieldsUnit}`.trim());
      }
      xml += this.otag('ingredient-list');
      recipe.ingredients.forEach((ingredient) => {
        const ingredientAtts = ingredient.optional ? { optional: 'yes' } : {};
        xml += this.otag('ingredient' , ingredientAtts);
        if (ingredient.amount) {
          xml += this.tag('amount', ingredient.amount);
        }
        if (ingredient.unit) {
          xml += this.tag('unit', ingredient.unit);
        }
        xml += this.tag('item', ingredient.item);
        xml += this.ctag('ingredient');
      });
      xml += this.ctag('ingredient-list');

      // Object.entries(recipe).forEach(([key, value]) => {
      //   if (key === 'ingredients') {
      //     xml += this.otag('ingredient-list');
      //     value.forEach((ingredient) => {
      //       xml += this.otag('ingredient');
      //       Object.entries(ingredient).forEach(([ingKey, ingValue]) => {
      //         xml += '  '.repeat(this.indent + 1) + `<${ingKey}>${ingValue}</${ingKey}>\n`;
      //       });
      //       xml += this.ctag('ingredient');
      //     });
      //     xml += this.ctag('ingredient-list');
      //   } else {
      //     xml += `${this.otag(key)}${value}\n${this.ctag(key)}`;
      //   }
      // });
      xml += this.ctag('recipe');
    });
    xml += this.ctag('recipe-list');
    xml += this.ctag('gourmetDoc');
    return xml;
  }
}

export default Exporter;
