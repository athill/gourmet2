import { useNavigate } from 'react-router-dom';
import RecipeForm from '../../../common/RecipeForm';

const initialValues = {
  title: '',
  yieldAmount: 0.0,
  yield: '',
  category: '',
  preptime: '',
  cooktime: '',
  cuisine: '',
  rating: 0,
  source: '',
  link: '',
  ingredients: [],
  instructions: '',
  notes: '',
};



const CreateRecipeForm = () => {
  const navigate = useNavigate();

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const result = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          yield: `${values.yieldAmount} ${values.yield}`.trim(),
        }),
      });
      navigate(`/recipes/${(await result.json()).id}`, { state: { pageAlert: { variant: 'success', children: 'Recipe created successfully!' } } });
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <RecipeForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      buttonText="Create Recipe"
      cancelUrl="/recipes" />
  );
};

export default CreateRecipeForm;
