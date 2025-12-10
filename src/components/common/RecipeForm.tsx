import { Formik , Field as FormikField, FieldArray} from 'formik';
import { Button, InputGroup, Modal } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as Yup from 'yup';

import Field, { FieldComponent } from '../form/fields';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';


 const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  yieldAmount: Yup.number().min(0, 'Yield amount must be non-negative').required('Yield amount is required'),
  yield: Yup.string().required('Yield unit is required'),
  category: Yup.string().required('Category is required'),
  preptime: Yup.string().matches(/\d+(\.\d+)? (seconds|hours|minutes|days)/, 'Preparation time must be in the format "number unit", e.g., "30 minutes"'),
  cooktime: Yup.string().matches(/\d+(\.\d+)? (seconds|hours|minutes|days)/, 'Cooking time must be in the format "number unit", e.g., "1 hour"'),
  cuisine: Yup.string().required('Cuisine is required'),
  rating: Yup.number().min(0.1, 'Rating must be at least 0.1').max(5, 'Rating cannot be more than 5'),
  source: Yup.string(),
  link: Yup.string().url('Webpage must be a valid URL'),
  instructions: Yup.string(),
  notes: Yup.string(),

 });

 const extractIngredients = (line: string, ingredientRegex: RegExp) => {
  const [ , amount, , unit, item] = line.match(ingredientRegex) || [];
  return { amount, unit, item };

};

type Props = {
  initialValues: any;
  onSubmit: (values: any) => void | Promise<void>;
  buttonText?: string;
};
const RecipeForm = ({ initialValues, onSubmit, buttonText = "Submit" }: Props) => {
  const [ showModal, setShowModal ] = useState(false);
  const { categories, cuisines, units } = useContext(AppContext);
  const [ ingredientRegex, setIngredientsRegex ] = useState<RegExp | null>(null);
  useEffect(() => {
    if (units.length > 0) {
      const regex = new RegExp(`^([\\d\\/\\.]+\\s+)?\\s*((${units.join('|').replaceAll('.', '\\.')})\\s+)?(.+)$`);
      setIngredientsRegex(regex);
    }
  }, [units]);

  const addBulkIngredientSubmit = (push: any, ingredientRegex: RegExp) => (e: any) => {
    e.preventDefault();
    console.log({e});

    const value = (document.getElementById('new-ingredients') as HTMLTextAreaElement).value || '';
    const lines = value.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    const ingredients = lines.map((line: string) => extractIngredients(line, ingredientRegex));
    ingredients.forEach((ingredient: any) => push(ingredient));
    setShowModal(false);
  }

  // console.log({initialValues});

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => (
        <>
          <form onSubmit={formik.handleSubmit} noValidate>

            <Tabs
              defaultActiveKey="description"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="description" title="Description">
                <Field name="title" label="Title" />
                <Field name="yield" label="Yield" FieldComponent={() => (
                  <InputGroup>
                    <FormikField as={FieldComponent} name="yieldAmount" type="number" size="sm" defaultValue={0.0} step="0.01" min="0" />
                    <FormikField as={FieldComponent}  name="yield" />
                  </InputGroup>
                )} />
                <Field name="category" label="Category" options={categories} />
                <Field name="preptime" label="Preparation Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
                <Field name="cooktime" label="Cooking Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
                <Field name="cuisine" label="Cuisine" options={cuisines} />
                <Field name="rating" label="Rating" type="number" defaultValue={0} step="1" min="0.1" max="5" size="sm" />
                <Field name="source" label="Source" />
                <Field name="link" label="Webpage" type="url" />
              </Tab>
              <Tab eventKey="ingredients" title="Ingredients">
                <div className="text-end">
                  <Button type="button" onClick={() => setShowModal(true)}>Bulk Add</Button>
                </div>
                <FieldArray name="ingredients">
                  {({ push, remove, form }) => (
                    <div>
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Bulk Add Ingredients</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                              <label htmlFor="new-ingredients" className="form-label">Ingredients (one per line, format: amount unit item)</label>
                              <textarea className="form-control" id="new-ingredients" rows={5} placeholder="e.g.&#10;1 cup sugar&#10;2 tbsp olive oil&#10;3 large eggs"></textarea>
                            </div>
                            <Button variant="primary" type="submit" onClick={addBulkIngredientSubmit(push, ingredientRegex)}>
                              Add Ingredients
                            </Button>
                        </Modal.Body>
                      </Modal>
                      {form.values.ingredients && form.values.ingredients.length > 0 ? (
                        form.values.ingredients.map((ingredient: string, index: number) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <InputGroup>
                                  <FormikField as={FieldComponent} name={`ingredients.${index}.amount`} placeholder="Amount" />
                                  <FormikField as={FieldComponent} name={`ingredients.${index}.unit`} placeholder="Unit" />
                                  <FormikField as={FieldComponent} name={`ingredients.${index}.item`} placeholder="Item" />
                                  <button type="button" onClick={() => remove(index)} style={{ marginLeft: '8px' }}>Remove</button>
                                </InputGroup>
                          </div>
                        ))
                      ) : (
                        <div>No ingredients added.</div>
                      )}
                      <Button type="button" onClick={() => push({ amount: '', unit: '', item: '' })}>Add Ingredient</Button>
                    </div>
                  )}
                </FieldArray>

              </Tab>
              <Tab eventKey="instructions" title="Instructions">
                <Field name="instructions" label="Instructions" field="textarea" />
              </Tab>
              <Tab eventKey="notes" title="Notes">
                <Field name="notes" label="Notes" field="textarea" />
              </Tab>
            </Tabs>
            <button type="submit">{buttonText}</button>
          </form>
        </>
      )}
    </Formik>
  );
};

export default RecipeForm;
