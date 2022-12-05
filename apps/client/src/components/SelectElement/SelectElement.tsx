import type { MenuItemProps, SelectProps } from '@mui/material';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type {
  Control,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import { ERROR_MESSAGES } from '../../constants';

export type SelectElementProps<T extends FieldValues> = Omit<
  SelectProps,
  'name'
> & {
  name: Path<T>;
  options: { label: string; value: MenuItemProps['value'] }[] | string[];
  control: Control<T>;
  helperText?: string;
  rules?: ControllerProps['rules'];
};

export const SelectElement = <T extends FieldValues>(
  props: SelectElementProps<T>,
): React.ReactElement => {
  const {
    rules,
    type,
    name,
    control,
    required,
    options,
    helperText,
    label,
    ...rest
  } = props;
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
    <FormControl>
      {label && (
        <InputLabel
          id={`${name}-label`}
          required={!!rules?.required || required}
          error={!!error}
          sx={{ backgroundColor: '#fff', px: 1 }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        {...rest}
        labelId={`${name}-label`}
        id={`${name}-id`}
        name={name}
        value={field.value}
        error={!!error}
        required={!!rules?.required || required}
        onBlur={field.onBlur}
        onChange={(event, child) => {
          field.onChange(event);
          if (typeof rest.onChange === 'function') {
            rest.onChange(event, child);
          }
        }}
      >
        {options.map((option) => {
          const isOptionString = typeof option === 'string';
          return (
            <MenuItem value={isOptionString ? option : option.value}>
              {isOptionString ? option : option.label}
            </MenuItem>
          );
        })}
      </Select>
      {(helperText || error) && (
        <FormHelperText error={!!error}>
          {error ? error.message : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
