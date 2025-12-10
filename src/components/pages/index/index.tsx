import { useEffect, useState } from "react";
import ListTable, { ListTablePrefix, Sort, SortDir } from "../../common/ListTable";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const IndexPage = () => {
  const [recipes, setRecipes] = useState([]); // Placeholder for recipes state
  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        console.log('Recipes:', data);
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
    getRecipes();
  }, []);
  const urlDisplay = /\w+:\/\/(www\.)?([^/]+).*/;
  const deleteRecipe = async (entity: { id: number, title: string }) => {
    if (!confirm(`Are you sure you want to delete the recipe "${entity.title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const response = await fetch(`/api/recipes/${entity.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRecipes(recipes.filter((recipe : any) => recipe.id !== entity.id));
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }
  return (
    <>
    <ListTablePrefix entityName="Recipe" entityPath="/recipes" />
    <ListTable
      columns={[
        {
          field: 'title',
          link: (entity) => `/recipes/${entity.id}`,
          filter: true
        },
        { field: 'category', filter: true },
        { field: 'cuisine', filter: true },
        {
          field: 'link',
          label: 'Source',
          link: (entity) => entity.link ? entity.link : null,
          display: (entity) => {
            // Get the domain from the link and remove www.
            const link = entity.link ? entity.link.replace(urlDisplay, '$2') : '';
            return link
          },
          sort: (a, b) => {
            const linkA = a.link.replace(urlDisplay, '$2');
            const linkB = b.link.replace(urlDisplay, '$2');
            return linkA.localeCompare(linkB);
          }
        },
        { field: 'rating', sort: (a, b) => a.rating - b.rating },
        { field: 'edit', sort: false, display: (entity) => <LinkContainer to={`/recipes/${entity.id}/edit`}><Button>Update</Button></LinkContainer> },
        { field: 'delete', sort: false, display: (entity) => <Button variant="danger" onClick={() => deleteRecipe(entity)}>Delete</Button> },
      ]}
      data={recipes}
      defaultSort={new Sort('title', SortDir.ASC)}
    />
    </>
  );
};

export default IndexPage;
