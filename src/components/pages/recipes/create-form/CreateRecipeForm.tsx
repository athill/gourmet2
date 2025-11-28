import { Formik , Field as FormikField} from 'formik';
import { InputGroup } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Field, FieldComponent } from '../../../form/fields';

const CreateRecipeForm = () => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>

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
              <Field name="category" label="Category" options={['Breakfast', 'Entree', 'Dessert']} />
              <Field name="prepTime" label="Preparation Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
              <Field name="cookTime" label="Cooking Time" pattern='\d+(\.\d+)? (seconds|hours|minutes|days)' />
              <Field name="cuisine" label="Cuisine" />
              <Field name="rating" label="Rating" type="number" defaultValue={0} step="1" min="0.1" max="5" size="sm" />
              <Field name="source" label="Source" />
              <Field name="link" label="Webpage" type="url" />
            </Tab>
            <Tab eventKey="ingredients" title="Ingredients">
              Tab content for Ingredients
            </Tab>
            <Tab eventKey="instructions" title="Instructions">
              Tab content for Instructions
            </Tab>
            <Tab eventKey="notes" title="Notes">
              Tab content for Notes
            </Tab>
          </Tabs>
          <button type="submit">Create Recipe</button>
        </form>
      )}
    </Formik>
  );
};

export default CreateRecipeForm;
