import { Col, Row } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import Link from '../../common/Link';


const Source = ({ recipe } : { recipe: any }) => {
  if (recipe.link && recipe.source) {
    return <div><dt>Source</dt><dd><a href={recipe.link} target="_blank" rel="noreferrer">{recipe.source}</a></dd></div>
  } else if (recipe.link) {
    const display = recipe.link.replace(/\w+:\/\/([^/]+).*/, '$1');
    return <div><dt>Source</dt><dd><a href={recipe.link} target="_blank" rel="noreferrer">{display}</a></dd></div>
  } else if (recipe.source) {
    return <div><dt>Source</dt><dd>{recipe.source}</dd></div>
  } else {
    return null;
  }
};

const recipeMetaMap : { header: string, key: string | ((recipe: any) => any) }[] = [
		{ header: 'Category', key: 'category' },
		{ header: 'Cuisine', key: 'cuisine' },
		{ header: 'Prep Time', key: 'preptime' },
    { header: 'Rating', key: (recipe) => recipe.rating ? <Rating readonly size={20} initialValue={recipe.rating} /> : 'N/A' },
		{ header: 'Servings', key: (recipe) => `${recipe.yieldsQuantity} ${recipe.yieldsUnit}` },
		{ header: 'Cook Time', key: 'cooktime' },
    { header: 'Source', key: (recipe: any) => <Source recipe={recipe} /> }
	],
	ingredientItems = ['amount','unit','item'],
	unitReplacements = [
		[/^teaspoons?$/i, 'tsp.'],
		[/^tablespoons?$/i, 'Tbs.']
	],
	ingredientItemWidthMap = {
			item: 8,
			unit: 2,
			amount: 2
	};

const Links = ({ id } : { id: number }) => (
	<span>
		<a href={`/print/recipes/${id}`} target="_blank" rel="noreferrer">Print</a>&nbsp;|&nbsp;
		<Link to={`/recipes/${id}/edit`}>Edit</Link>
	</span>
);

const Recipe = ({ recipe, isScreenDisplay=true } : { recipe: any, isScreenDisplay?: boolean }) => (
	<div id={`recipe-${recipe.id}`} className="recipe">
		<h4 id={recipe.name} className="recipe-title">{recipe.title}</h4>
		<div className="recipe-main">
			<table className="recipe-meta">
        <tbody>
          {
            recipeMetaMap.map(map => <tr key={map.header}>
              <th scope="row">{map.header}</th>
              <td>{typeof map.key === 'function' ? map.key(recipe) : recipe[map.key]}</td>
            </tr>)
          }
        </tbody>
			</table>
			<h5>Ingredients:</h5>
			<div className="container-fluid recipe-ingredients">
				<Row>
					<Col>
          <table className='recipe-ingredients'>
            <tbody>
              {
                recipe.ingredients.map((ingredient: any, i: number) => (
                  <tr key={`${ingredient.item}-${i}`}>
                  {
                    ingredientItems.map((item: any, i: number) => {
                      if (item === 'unit' && item.unit) {
                        unitReplacements.forEach(function(replacement) {
                          ingredient[item] = ingredient[item].replace(replacement[0], replacement[1]);
                        });
                      }
                      return <td key={i}>{ ingredient[item] || '' }</td>;
                    })
                  }
                  </tr>
                ))
              }
            </tbody>
          </table>
					</Col>
				</Row>
			</div>
			<h5>Instructions:</h5>
			{ recipe.instructions.split('\n').map((instruction: any, i: number) => <div key={`${instruction}-${i}`}>{ instruction }</div>) }
			{ 'notes' in recipe && <div><h5>Notes</h5>{ recipe.notes?.split('\n').map((note: string, i: number) => <div key={`${note}-${i}`}>{ note }</div>) } </div> }
		</div>
			{ isScreenDisplay && <Links id={recipe.id} /> }
    </div>
);

export default Recipe;
