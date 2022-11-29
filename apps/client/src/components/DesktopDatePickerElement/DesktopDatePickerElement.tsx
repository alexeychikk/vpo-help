import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import type { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import type {
  Control,
  ControllerProps,
  Path,
  PathValue,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { Optional } from 'utility-types';

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
    transform?: (date: moment.Moment | null) => unknown;
  };

export const DesktopDatePickerElement = <T extends Record<string, unknown>>(
  props: DesktopDatePickerElementProps<T>,
): React.ReactElement => {
  const { rules, name, control, transform, ...rest } = props;
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <DesktopDatePicker
      {...rest}
      label="Date desktop"
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
      onClose={field.onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          error={!!error}
          helperText={error ? error.message : params.helperText}
        />
      )}
    />
  );
};
