import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { BOOKING, MAIN } from '../../constants';

export type ErrorModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  detailedMessage?: string;
  onClose?: () => unknown;
  children: React.ReactElement;
};

export const ErrorModal: React.FC<ErrorModalProps> = (props) => {
  const [expandedForm, setExpandedForm] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedForm(isExpanded ? panel : false);
    };

  const handleModalClose = () => {
    props.onClose?.();
  };

  return (
    <Dialog open={props.isOpen} onClose={handleModalClose}>
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
          {props.message}
        </DialogContentText>
        <Accordion
          key="details"
          expanded={expandedForm === 'details'}
          sx={{ width: '100%' }}
          onChange={handleAccordionChange('details')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{MAIN.details}</Typography>
          </AccordionSummary>
          <AccordionDetails>{props.detailedMessage}</AccordionDetails>
        </Accordion>
      </DialogContent>
      {props.children}
    </Dialog>
  );
};
