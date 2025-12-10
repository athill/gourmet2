import {  Col, Form, Row, type FormCheckProps, type FormControlProps, type FormSelectProps } from 'react-bootstrap';

import { connect, Field as FormikField, type FormikProps } from 'formik'

type FieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'combobox';
type OptionType = { value: string; label: string };

interface FieldComponentProps extends React.HTMLAttributes<HTMLElement>  {
  field?: FieldType
  FieldComponent?: React.FC;
  controlId?: string;
  name: string;
  options?: Array<OptionType | string>; // for select and combobox
}

interface FieldProps extends FieldComponentProps {
  controlId?: string;
  formik?: any;
  inline?: boolean;
  label: string;
}

const Options = ({ options }: { options: Array<OptionType> }) => {
  return (
    <>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </>
  );
}

export const FieldComponent = ({ field = 'input', options = [], name, ...props }: (FormControlProps | FormCheckProps | FormSelectProps) & FieldComponentProps) => {
  props.controlId = props.controlId || name;
  const normalizeOptions: Array<OptionType> = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  let FieldComponent;
  if (field === 'select') {
    FieldComponent = () => (
      <Form.Select name={name} {...(props as FormSelectProps)}>
        <Options options={normalizeOptions} />
      </Form.Select>
    );
  } else if (['input', 'textarea', 'combobox'].includes(field)) {
    props = props as FormControlProps;
    if (field === 'textarea') {
      props.as = 'textarea';
    }
    if (options.length) {
      props.list = `${name}-datalist`;
    }
    console.log('Rendering FieldComponent with props:', name, props);
    FieldComponent = () => <>
      <Form.Control name={name} value={props?.values?.[name] || null} {...(props as FormControlProps | FormikProps<any>)} />
      {options.length > 0 && (
        <datalist id={`${name}-datalist`}>
          <Options options={normalizeOptions} />
        </datalist>
      )}
    </>
  } else if (['checkbox', 'radio'].includes(field)) {
    FieldComponent = () => (<p>ToDo</p>);
    // props = props as FormCheckProps;

    // field as FormCheckProps['type'];
    // FieldComponent = () => (
    // <>
    //   {
    //     normalizeOptions.map((option) => (
    //        <Form.Check
    //         type="checkbox"
    //         key={option.value}
    //         name={name}
    //         label={option.label}
    //         value={option.value}
    //         {...props}
    //        />
    //     ))
    //   }
    //   </>
    // );
  } else {
    throw new Error(`Unsupported field type: ${field}`);
  }
  return <FieldComponent />;
};


export const Field = ({ controlId, id, formik, field = 'input', FieldComponent : FieldComponentProp, inline = true, label, name, options, ...props }: FieldProps & (FormControlProps | FormCheckProps)) => {

  const error = formik?.touched?.[name] && formik?.errors?.[name];
  if (!FieldComponentProp) {
    FieldComponentProp = () => <FieldComponent field={field} name={name} options={options} isInvalid={!!error} {...formik} {...props} />;
  }

  // console.log({error, name, isInvalid: !!error});
  const Error = () => {
    return error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : null;
  }
  return (
    <Form.Group className="mb-3" controlId={controlId || id || name} as={inline ? Row : undefined}>
      <Form.Label {...(inline ? { sm: 2, column: true } : {})}>{label}</Form.Label>
      {
        inline ? (<Col sm={10}>
          <FormikField as={FieldComponentProp}  />
          <Error />
        </Col>
        ) : (
          <>
            <FormikField as={FieldComponentProp} />
            <Error />
          </>
        )
      }

    </Form.Group>
  );

}



export default connect(Field);
