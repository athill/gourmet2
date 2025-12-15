import {  Col, Form, Row, type FormCheckProps, type FormControlProps, type FormSelectProps } from 'react-bootstrap';

import { connect, Field as FormikField, useFormikContext, type FormikProps } from 'formik'
import type { JSX } from 'react';

type FieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'combobox';
type OptionType = { value: string; label: string };

interface FieldComponentProps extends React.HTMLAttributes<HTMLElement>  {
  field?: FieldType
  FieldComponent?: JSX.ElementType;
  controlId?: string;
  name: string;
  options?: Array<OptionType | string>; // for select and combobox
}

// interface FieldProps extends FieldComponentProps {
//   controlId?: string;
//   formik?: any;
//   inline?: boolean;
//   label: string;
// }

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

export const UnconnectedFieldComponent = ({ field = 'input', formik, options = [], name, ...props }: (FormControlProps | FormCheckProps | FormSelectProps) & FieldComponentProps) => {
  const error = formik?.touched?.[name] && formik?.errors?.[name];
  const normalizeOptions: Array<OptionType> = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  let FieldComponent;
  const allProps = {
    ...props,
    value: formik?.values?.[name] || '',
    onChange: formik?.handleChange,
    onBlur: formik?.handleBlur,
    isInvalid: !!error,
    isValid: formik?.touched?.[name] && !error,
  }
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
    FieldComponent = () => <>
      <Form.Control name={name} {...(allProps as FormControlProps | FormikProps<any>)} />
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

// export const FieldComponent = connect(UnconnectedFieldComponent);

export const FieldComponent = ({ field = 'input', options = [], name, ...props }: (FormControlProps | FormCheckProps | FormSelectProps) & FieldComponentProps) => {
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<any>();
  const error = touched?.[name] && errors?.[name];
  const normalizeOptions: Array<OptionType> = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  let FieldComponent;
  const allProps = {
    ...props,
    value: values?.[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    isInvalid: !!error,
    isValid: touched?.[name] && !error,
  }
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
    FieldComponent = () => <>
      <Form.Control name={name} {...(allProps as FormControlProps | FormikProps<any>)} />
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
}

const normalizeOptions = (options: Array<OptionType | string>): Array<OptionType> => options.map(option => typeof option === 'string' ? { value: option, label: option } : option);

const getValue = (formik: any, name: string) : string => {
  if (name.includes('.')) {
    const parts = name.split('.');
    let value = formik?.values || {};
    for (const part of parts) {
      value = value ? value[part] : '';
      console.log({part, value});
    }
    return value;
  }
  return formik?.values?.[name] || '';
}

export const Input = ({ name , options = [], ...props}: FormControlProps & { name: string, options?: Array<OptionType | string>}) => {
  const formik = useFormikContext<any>();
  const error = formik?.touched?.[name] && formik?.errors?.[name];
  const normalizedOptions = normalizeOptions(options);
  if (options.length) {
    props.list = `${name}-datalist`;
    props.autoComplete = 'off';
  }
  console.log({name, value: getValue(formik, name)});
  return (
    <>
      <Form.Control
        name={name}
        {...props}
        value={getValue(formik, name)}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        isInvalid={!!error}
        isValid={formik?.touched?.[name] && !error}
      />
      {normalizedOptions.length > 0 && (
        <datalist id={`${name}-datalist`}>
          <Options options={normalizedOptions} />
        </datalist>
      )}
    </>
  )
}

export const Textarea = ({ name , ...props}: FormControlProps & { name: string}) => {
  return (
      <Input as="textarea"
        name={name}
        {...props} />
  )
}

type FieldGroupProps = { children: React.ReactNode; controlId?: string; label: string; inline?: boolean };

export const FieldGroup = ({ children, controlId, label, inline = true }: FieldGroupProps): JSX.Element => {
    return (
      <Form.Group className="mb-3" controlId={controlId} as={inline ? Row : undefined}>
        <Form.Label {...(inline ? { sm: 2, column: true } : {})}>{label}</Form.Label>
        {
          inline ? (<Col sm={10}>
            {children}
          </Col>
          ) : (
            <>
              {children}
            </>
          )
        }
      </Form.Group>
    )
}

type FieldProps = (FormControlProps | FormCheckProps) & {
  Component?: JSX.ElementType;
  label: string;
  name: string;
  options?: Array<OptionType | string>; // for select and combobox
};

export const Field = ({ Component = Input, label, name, options = [] , ...props}: FormControlProps & FieldProps) => {
  const formik = useFormikContext<any>();
  return (
      <FieldGroup controlId={name} label={label}>
        <Component name={name} options={options} {...props}  />
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name].toString()}</div>
        ) : null}
     </FieldGroup>
  );
}


// export const Field = ({ controlId, id, formik, field = 'input', FieldComponent : FieldComponentProp = FieldComponent, inline = true, label, name, options, ...props }: FieldProps & (FormControlProps | FormCheckProps)) => {
//   const error = formik?.touched?.[name] && formik?.errors?.[name];
//   const allProps = {
//     ...props,
//     as: FieldComponentProp,
//     name,
//     field,
//     options,
//   };
//   const formikProps = {
//     ...allProps,
//     ...formik
//   };

//   const Error = () => {
//     return error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : null;
//   }
//   return (
    // <Form.Group className="mb-3" controlId={controlId || id || name} as={inline ? Row : undefined}>
    //   <Form.Label {...(inline ? { sm: 2, column: true } : {})}>{label}</Form.Label>
//       {
//         inline ? (<Col sm={10}>
//           <FormikField {...formikProps} />
//           <Error />
//         </Col>
//         ) : (
//           <>
//             <FormikField {...formikProps} />
//             <Error />
//           </>
//         )
//       }
//     </Form.Group>
//   );

// }



export default connect(Field);
