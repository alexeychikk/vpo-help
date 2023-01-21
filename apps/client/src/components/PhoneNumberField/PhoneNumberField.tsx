import type { TextFieldProps } from '@mui/material';
import { isPhoneNumber } from 'class-validator';
import React from 'react';
import type { Control, ControllerProps, Path } from 'react-hook-form';
import { ERROR_MESSAGES } from '../../constants';
import { TextFieldElement } from '../TextFieldElement';

export type PhoneNumberFieldProps<T extends Record<string, unknown>> = Omit<
  TextFieldProps,
  'name'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps['rules'];
};

export const PhoneNumberField = <T extends Record<string, unknown>>(
  props: PhoneNumberFieldProps<T>,
): React.ReactElement => {
  return (
    <TextFieldElement<T>
      {...props}
      type="tel"
      helperText="+380XXXXXXXXX"
      rules={{
        ...props.rules,
        validate: {
          ...props.rules?.validate,
          pattern: (value) =>
            value
              ? !isPhoneNumber(value)
                ? ERROR_MESSAGES.patternPhone
                : undefined
              : undefined,
        },
      }}
    />
  );
};
