import { Formik , Field as FormikField, FieldArray} from 'formik';
import { Button, Col, Container, InputGroup, Modal, Row } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as Yup from 'yup';
import { Rating } from 'react-simple-star-rating'

import { Field, FieldComponent, FieldGroup, Input, Textarea } from '../form/fields';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';
import { useNavigate } from 'react-router';


const timeRegex = /\d+(\/\d+)?(\.\d+)? (seconds?|hours?|minutes?|days?)/;
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  yieldsQuantity: Yup.number().min(0, 'Yield amount must be non-negative').required('Yield amount is required'),
  yieldsUnit: Yup.string().required('Yield unit is required'),
  category: Yup.string().required('Category is required'),
  preptime: Yup.string().matches(timeRegex, 'Preparation time must be in the format "number unit", e.g., "30 minutes"'),
  cooktime: Yup.string().matches(timeRegex, 'Cooking time must be in the format "number unit", e.g., "1 hour"'),
  cuisine: Yup.string().required('Cuisine is required'),
  rating: Yup.number().min(0.1, 'Rating must be at least 0.1').max(5, 'Rating cannot be more than 5'),
  source: Yup.string(),
  // link: Yup.string().url('Webpage must be a valid URL'),
  instructions: Yup.string(),
  notes: Yup.string(),

 });



 const extractIngredients = (line: string, ingredientRegex: RegExp) => {
  const [ , amount, , unit, item] = line.match(ingredientRegex) || [];
  return { amount, unit, item };

};

type RecipeFormProps = {
  initialValues: any;
  onSubmit: (values: any) => void | Promise<void>;
  buttonText?: string;
  cancelUrl?: string;
};
const RecipeForm = ({ initialValues, onSubmit, buttonText = "Submit", cancelUrl }: RecipeFormProps) => {
  const [ showModal, setShowModal ] = useState(false);
  const { categories, cuisines, units, yieldsUnits } = useContext(AppContext);
  const [ ingredientRegex, setIngredientsRegex ] = useState<RegExp | null>(null);
  const navigate = useNavigate();
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

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={async (values) => {
      console.log('Form values on submit:', values);
      await onSubmit(values);
    }}>
      {(formik) => (
        <>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Form values on submit:', formik.values);
            try {
              formik.handleSubmit(e);
            } catch (error) {
              console.error('Error during form submission:', error);
            }
            }} noValidate>

            <Tabs
              defaultActiveKey="description"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="description" title="Description">
                <Field name="title" label="Title" />
                <FieldGroup controlId="yield" label="Yield">
                  <InputGroup>
                    <Input name="yieldsQuantity" type="number" size="sm" step="0.01" min="0" />
                    <Input name="yieldsUnit" options={yieldsUnits} />
                  </InputGroup>
                </FieldGroup>
                <Field name="category" label="Category" options={categories} />
                <Field name="preptime" label="Preparation Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
                <Field name="cooktime" label="Cooking Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
                <Field name="cuisine" label="Cuisine" options={cuisines} />
                <FieldGroup controlId="rating" label="Rating">
                  <>
                    <Rating onClick={(rate: number) => formik.setFieldValue('rating', rate)} initialValue={formik.values.rating} />
                    <FormikField name="rating" type="number" step="1" min="0.1" max="5" style={{ display: 'none' }} />
                  </>
                </FieldGroup>
                <Field name="source" label="Source" />
                <Field name="link" label="Webpage" type="url" />
              </Tab>
              <Tab eventKey="ingredients" title="Ingredients">
                <Container>
                  <Row>
                    <Col className="text-end py-2">
                      <Button variant="secondary" type="button" onClick={() => setShowModal(true)}>Bulk Add</Button>
                    </Col>
                  </Row>
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
                          form.values.ingredients.map((ingredient: object, index: number) => {
                            console.log({ingredient, index, values: form.values});
                            return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                  <InputGroup>
                                    <Input name={`ingredients.${index}.amount`} placeholder="Amount" />
                                    <Input name={`ingredients.${index}.unit`} placeholder="Unit" />
                                    <Input name={`ingredients.${index}.item`} placeholder="Item" />
                                    <Button type="button" onClick={() => remove(index)} style={{ marginLeft: '8px' }}>Remove</Button>
                                  </InputGroup>
                            </div>
                          )})
                        ) : (
                          <div>No ingredients added.</div>
                        )}
                        <Button type="button" onClick={() => push({ amount: '', unit: '', item: '' })}>Add Ingredient</Button>
                      </div>
                    )}
                  </FieldArray>
                </Container>
              </Tab>
              <Tab eventKey="instructions" title="Instructions">
                <Field Component={Textarea} name="instructions" label="Instructions"  />
              </Tab>
              <Tab eventKey="notes" title="Notes">
                <Field Component={Textarea} name="notes" label="Notes"  />
              </Tab>
            </Tabs>
            <Row>
              <Col className="text-end">
                {cancelUrl && <Button variant="secondary" onClick={() => navigate(cancelUrl)} className="ms-2">Cancel</Button>}
                <Button type="submit">{buttonText}</Button>
              </Col>
            </Row>


          </form>
        </>
      )}
    </Formik>
  );
};

export default RecipeForm;
