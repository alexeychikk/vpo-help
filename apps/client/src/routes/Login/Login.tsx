import { LockOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { TextFieldElement } from '../../components';
import { LOGIN } from '../../constants';

export type LoginFormFields = typeof LOGIN.form;

export const Login = () => {
  const form = useForm<LoginFormFields>();
  const handleSubmit: SubmitHandler<LoginFormFields> = useCallback((data) => {
    console.log(data);
  }, []);

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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
