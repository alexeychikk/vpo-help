import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ButtonWithLoading, TextFieldElement } from '../../components';
import { LOGIN } from '../../constants';
import { authService } from '../../services';
import { ROUTES } from '../routes.config';

export type LoginFormFields = typeof LOGIN.form;

export const Login = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormFields>();
  const [loading, setLoading] = useState(false);

  const handleSubmit: SubmitHandler<LoginFormFields> = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await authService.loginAdmin(data);
        navigate(ROUTES.ADMIN.path);
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            form.setError('email', { message: LOGIN.error });
            form.setError('password', { message: LOGIN.error });
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {LOGIN.title}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
          sx={{ mt: 1 }}
        >
          <TextFieldElement
            fullWidth
            autoFocus
            required
            id="email"
            name="email"
            label={LOGIN.form.email}
            margin="normal"
            autoComplete="email"
            control={form.control}
          />
          <TextFieldElement
            fullWidth
            required
            id="password"
            name="password"
            label={LOGIN.form.password}
            type="password"
            margin="normal"
            autoComplete="current-password"
            control={form.control}
          />
          <ButtonWithLoading
            fullWidth
            type="submit"
            variant="contained"
            sx={{ my: 2 }}
            loading={loading}
          >
            {LOGIN.button}
          </ButtonWithLoading>
        </Box>
      </Box>
    </Container>
  );
};
