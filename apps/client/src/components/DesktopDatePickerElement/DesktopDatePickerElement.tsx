import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import type { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import type moment from 'moment';
import type {
  Control,
  ControllerProps,
  Path,
  PathValue,
} from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import type { Optional } from 'utility-types';
import { ERROR_MESSAGES } from '../../constants';

export type DesktopDatePickerElementProps<T extends Record<string, unknown>> =
  Omit<
    Optional<
      DesktopDatePickerProps<PathValue<T, Path<T>>, moment.Moment>,
      'onChange'
    >,
    'name' | 'value' | 'renderInput'
  > & {
    name: Path<T>;
    control: Control<T>;
    rules?: ControllerProps['rules'];
    required?: boolean;
    transform?: (date: moment.Moment | null) => unknown;
  };

export const DesktopDatePickerElement = <T extends Record<string, unknown>>(
  props: DesktopDatePickerElementProps<T>,
): React.ReactElement => {
  const { rules, name, control, transform, required, ...rest } = props;
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? ERROR_MESSAGES.requiredDate : rules?.required,
      ...rules,
    },
  });
  const context = useFormContext<T>();
  console.log(context.getValues());

  return (
    <DesktopDatePicker
      {...rest}
      inputFormat="DD.MM.YY"
      value={field.value}
      onChange={(date) => {
        field.onChange(
          typeof transform === 'function' ? transform(date) : date,
        );
        if (typeof rest.onChange === 'function') {
          rest.onChange(date);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          error={!!error}
          required={!!rules?.required || required}
          helperText={error ? error.message : params.helperText}
          onBlur={(event) => {
            if (
              (!event.target.value ||
                !/\d\d.\d\d.\d\d/.test(event.target.value)) &&
              context
            ) {
              context.setValue(name, undefined as PathValue<T, Path<T>>);
            }
            field.onBlur();
          }}
        />
      )}
    />
  );
};
