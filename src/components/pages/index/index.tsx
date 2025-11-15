import { useEffect, useState } from "react";
import ListTable, { Sort, SortDir } from "../../common/ListTable";

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
  return (
    <ListTable
      columns={[
        { field: 'title' },
        { field: 'category' },
        { field: 'cuisine' },
        { field: 'link' },
        { field: 'rating' },
      ]}
      data={recipes}
      defaultSort={new Sort('title', SortDir.ASC)}
    />
  );
};

export default IndexPage;
