
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RecipeForm from "../../../common/RecipeForm";

const EditRecipeForm = () => {
  const { id } = useParams();
  const [ initialValues, setInitialValues ] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      setInitialValues({
        ...data
      });
    };
    fetchRecipe();
  }, []);

  const onSubmit = async (values: typeof initialValues) => {
    await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        // yield: `${values.yieldAmount} ${values.yield}`.trim(),
      }),
    });
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }


  return <RecipeForm initialValues={initialValues} buttonText="Update Recipe" onSubmit={onSubmit} />;
};

export default EditRecipeForm;
