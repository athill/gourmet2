
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RecipeForm from "../../../common/RecipeForm";

const EditRecipeForm = () => {
  const { id } = useParams();
  const [ initialValues, setInitialValues ] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      Object.keys(data).forEach(key => {
        if (data[key] === null) {
          data[key] = '';
        }
      });
      setInitialValues(data);
    };
    fetchRecipe();
  }, [id]);

  const onSubmit = async (values: typeof initialValues) => {
    console.log('Submitting values:', values);
    try {
      await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      navigate(`/recipes/${id}`, { state: { pageAlert: { variant: 'success', children: 'Recipe updated successfully!' } } });
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }


  return <RecipeForm
    initialValues={initialValues}
    buttonText="Update Recipe"
    onSubmit={onSubmit}
    cancelUrl={`/recipes/${id}`} />;
};

export default EditRecipeForm;
