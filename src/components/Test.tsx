import { Formik, useFormikContext } from "formik";
import { Form, type FormControlProps } from "react-bootstrap";

const Test = () => {
  return (
    <Formik initialValues={{ testField: '' }} onSubmit={(values) => (
      console.log('Test form submitted with values:', values)
    )}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <TestField label="Test Field" name="testField" />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};

export const Input = ({ name , ...props}: FormControlProps & { name: string}) => {
  const formik = useFormikContext<any>();
  const error = formik?.touched?.[name] && formik?.errors?.[name];
  return (
      <Form.Control
        name={name}
        {...props}
        value={formik?.values?.[name] || ''}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        isInvalid={!!error}
        isValid={formik?.touched?.[name] && !error}
      />
  )
}

export const Textarea = ({ name , ...props}: FormControlProps & { name: string}) => {
  const formik = useFormikContext<any>();
  const error = formik?.touched?.[name] && formik?.errors?.[name];
  return (
      <Input as="textarea"
        name={name}
        {...props} />
  )
}

export const TestField = ({ label, name , ...props}: FormControlProps & { label: string; name: string}) => {
  const formik = useFormikContext<any>();
  return (
      <Form.Group controlId="testField">
        <Form.Label>{label}</Form.Label>
        <Input name={name} {...props} />
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name].toString()}</div>
        ) : null}
    </Form.Group>
  );
}

export default Test;
