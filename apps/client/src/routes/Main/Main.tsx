import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useRef } from 'react';
import { MAIN } from '../../constants';
import { Footer } from './Footer';

export const Main = () => {
  const theme = useTheme();
  const referenceNumberRef = useRef<HTMLInputElement>();

  const searchVPO = useCallback(() => {
    console.log(referenceNumberRef.current?.value);
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: { xs: 0 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ p: 4, display: 'flex', flexGrow: 1, justifyContent: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" marginBottom={2}>
              {MAIN.findBooking.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                inputRef={referenceNumberRef}
                id="referenceNumber"
                name="referenceNumber"
                label={MAIN.findBooking.label}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ pl: 5, pr: 5 }}
                onClick={searchVPO}
              >
                {MAIN.findBooking.button}
              </Button>
            </Box>
            <Box
              sx={{
                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                color: theme.palette.grey[400],
                textAlign: 'center',
                height: '1rem',
                mt: 3,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  display: 'inline',
                  backgroundColor: theme.palette.background.default,
                  pr: 3,
                  pl: 3,
                }}
              >
                {MAIN.separator}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIosIcon />}
              sx={{ mt: 2, pl: 5, pr: 5 }}
              href="/booking"
            >
              {MAIN.startBooking}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Container>
  );
};
