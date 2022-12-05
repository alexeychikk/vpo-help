import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useAsync } from 'react-use';
import type { VpoUserModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import {
  BookingInfo,
  ButtonWithLoading,
  TextFieldElement,
} from '../../components';
import { MAIN } from '../../constants';
import { authService, htmlService } from '../../services';
import { ROUTES } from '../routes.config';
import { Footer } from './Footer';

export const Main = () => {
  const theme = useTheme();
  const form = useForm<{ referenceNumber: string }>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Serialized<VpoUserModel> | null>(null);

  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    return info.content;
  });

  const searchVpo: SubmitHandler<{ referenceNumber: string }> = useCallback(
    async ({ referenceNumber }) => {
      if (referenceNumber) {
        try {
          setLoading(true);
          const vpoUser = await authService.loginVpo(referenceNumber);
          form.reset();
          setUser(vpoUser);
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              form.setError('referenceNumber', {
                message: MAIN.findBooking.error,
              });
            }
          }
        } finally {
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: '400px',
        p: { xs: 0 },
      }}
    >
      {infoResponse.loading ? (
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          <Container
            maxWidth="xl"
            sx={{
              p: 4,
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            {user ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <BookingInfo
                  vpoReferenceNumber={user.vpoReferenceNumber}
                  bookingDate={user.scheduleDate}
                />
                <Button variant="contained" onClick={() => setUser(null)}>
                  {MAIN.backToMain}
                </Button>
              </Box>
            ) : (
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
                  <Box
                    component="form"
                    noValidate
                    onSubmit={form.handleSubmit(searchVpo)}
                    sx={{ display: 'flex' }}
                  >
                    <TextFieldElement
                      fullWidth
                      required
                      id="referenceNumber"
                      name="referenceNumber"
                      label={MAIN.findBooking.label}
                      sx={{ mr: 2 }}
                      control={form.control}
                    />
                    <ButtonWithLoading
                      type="submit"
                      variant="contained"
                      startIcon={<SearchIcon />}
                      sx={{ px: 5, mt: '10px' }}
                      loading={loading}
                    >
                      {MAIN.findBooking.button}
                    </ButtonWithLoading>
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
                    href={ROUTES.BOOKING.path}
                  >
                    {MAIN.startBooking}
                  </Button>
                </Box>
              </Box>
            )}
          </Container>
          <Footer />
        </>
      )}
    </Container>
  );
};
