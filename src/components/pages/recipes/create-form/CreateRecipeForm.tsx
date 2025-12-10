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

const onSubmit = async (values: typeof initialValues) => {
  await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...values,
      yield: `${values.yieldAmount} ${values.yield}`.trim(),
    }),
  });
};

const CreateRecipeForm = () => (
  <RecipeForm initialValues={initialValues} onSubmit={onSubmit} buttonText="Create Recipe' />
);

export default CreateRecipeForm;
