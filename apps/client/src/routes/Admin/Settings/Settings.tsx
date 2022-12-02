import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { ADMIN } from '../../../constants';

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        'Settings'
      )}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          {ADMIN.errorModal.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {ADMIN.errorModal.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            autoFocus
          >
            {ADMIN.errorModal.closeButton}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
