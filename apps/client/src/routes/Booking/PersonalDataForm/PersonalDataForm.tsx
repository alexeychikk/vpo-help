import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Fab,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BOOKING } from '../../../constants';
import type { VpoForm } from '../Booking';
import { FormFields } from './FormFields';

export const PersonalDataForm: React.FC = () => {
  const { control, watch, getValues, formState } = useFormContext<VpoForm>();
  const { errors, submitCount } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'relativeVpos',
    rules: { maxLength: 20 },
  });
  const [expandedForm, setExpandedForm] = useState<string | false>(`sibling-1`);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedForm(isExpanded ? panel : false);
    };

  const handleAddRelative = () => {
    if (fields.length < 20) {
      append({ scheduleDate: getValues().scheduleDate } as VpoForm);
      setExpandedForm(`sibling${fields.length}`);
    }
  };

  const handleRemoveRelative = (index: number) => {
    if (fields.length !== 0) {
      remove(index);
      if (expandedForm === `sibling${index}`) {
        setExpandedForm(false);
      }
    }
  };

  useEffect(() => {
    let firstErrorFieldName = (
      Object.keys(errors) as (keyof typeof errors)[]
    )[0];

    if (firstErrorFieldName) {
      if (Array.isArray(errors[firstErrorFieldName!])) {
        firstErrorFieldName = Object.keys(
          errors[firstErrorFieldName!]!,
        )[0] as keyof typeof errors[typeof firstErrorFieldName];
      } else {
        firstErrorFieldName =
          '-1' as keyof typeof errors[typeof firstErrorFieldName];
      }

      setExpandedForm(`sibling${firstErrorFieldName}`);
    }
  }, [errors, submitCount]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Accordion
        expanded={expandedForm === `sibling-1`}
        sx={{ width: '100%' }}
        onChange={handleAccordionChange(`sibling-1`)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Typography>{BOOKING.accordionTitlePrefix}</Typography>
            <Button size="small" disabled sx={{ minWidth: '0', ml: 1 }}>
              <DeleteOutlineIcon />
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormFields />
        </AccordionDetails>
      </Accordion>
      {fields.map((field, index) => (
        <Accordion
          key={field.id}
          expanded={expandedForm === `sibling${index}`}
          sx={{ width: '100%' }}
          onChange={handleAccordionChange(`sibling${index}`)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Typography>
                {`${BOOKING.accordionRelativeTitlePrefix}${
                  watch(`relativeVpos.${index}.vpoReferenceNumber`) ||
                  BOOKING.form.vpoReferenceNumberHelper
                }`}
              </Typography>
              <Button
                size="small"
                aria-label="remove"
                title={BOOKING.removeRelative}
                onClick={(event: React.SyntheticEvent) => {
                  event.stopPropagation();
                  handleRemoveRelative(index);
                }}
                sx={{ minWidth: '0', ml: 1 }}
              >
                <DeleteOutlineIcon />
              </Button>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FormFields index={index} arrayKey="relativeVpos" />
          </AccordionDetails>
        </Accordion>
      ))}
      <Box
        sx={{ display: 'flex', width: '100%', justifyContent: 'center', p: 2 }}
      >
        <Button
          variant="contained"
          aria-label="add"
          startIcon={<AddIcon />}
          disabled={fields.length >= 20}
          onClick={handleAddRelative}
        >
          {BOOKING.addRelative}
        </Button>
      </Box>
    </Box>
  );
};
