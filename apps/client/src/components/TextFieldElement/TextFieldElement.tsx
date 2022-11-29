import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import type {
  Control,
  ControllerProps,
  FieldError,
  Path,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import { ERROR_MESSAGES } from '../../constants';

export type TextFieldElementProps<T extends Record<string, unknown>> = Omit<
  TextFieldProps,
  'name'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps['rules'];
};

export const TextFieldElement = <T extends Record<string, unknown>>(
  props: TextFieldElementProps<T>,
): React.ReactElement => {
  const { rules, type, name, control, required, ...rest } = props;
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? ERROR_MESSAGES.required : rules?.required,
      ...rules,
    },
  });

  return (
    <TextField
      {...rest}
      name={name}
      value={field.value ?? ''}
      onChange={(event) => {
        field.onChange(event);
        if (typeof rest.onChange === 'function') {
          rest.onChange(event);
        }
      }}
      onBlur={field.onBlur}
      required={!!rules?.required}
      type={type}
      error={!!error}
      helperText={error ? error.message : rest.helperText}
    />
  );
};
