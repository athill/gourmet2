import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Recipe from "../Recipe";

const ViewRecipe = () => {
  const { id } = useParams();
  const [ recipe, setRecipe ] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      // Handle the fetched recipe data
      setRecipe(data);
    };
    fetchRecipe();
  }, [id]);
  if (!recipe) {
    return <div>Loading...</div>;
  }
  return (
    <Recipe recipe={recipe} isScreenDisplay={false} />
  );
};

export default ViewRecipe;
