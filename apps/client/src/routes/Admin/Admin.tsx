import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Admin = () => {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: { xs: 0 },
      }}
    >
      <Header />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </Container>
  );
};
