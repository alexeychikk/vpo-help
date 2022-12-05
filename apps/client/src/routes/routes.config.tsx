import { Box, LinearProgress } from '@mui/material';
import React, { Suspense } from 'react';
import { Booking } from './Booking';
import { Main } from './Main';

const Admin = React.lazy(() => import('./Admin'));
const Schedule = React.lazy(() => import('./Admin/Schedule'));
const Settings = React.lazy(() => import('./Admin/Settings'));
const VpoTable = React.lazy(() => import('./Admin/VpoTable'));
const Login = React.lazy(() => import('./Login'));

const Loading = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
);

export const ROUTES = {
  MAIN: {
    path: '/',
    render: () => <Main />,
  },
  BOOKING: {
    path: '/booking',
    render: () => <Booking />,
  },
  LOGIN: {
    path: '/login',
    render: () => (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  ADMIN: {
    path: '/admin',
    private: true,
    render: () => (
      <Suspense fallback={<Loading />}>
        <Admin />
      </Suspense>
    ),
    subroutes: {
      VPO_INDEX: {
        path: '',
        render: () => (
          <Suspense fallback={<Loading />}>
            <VpoTable />
          </Suspense>
        ),
      },
      VPO: {
        path: 'vpo',
        render: () => (
          <Suspense fallback={<Loading />}>
            <VpoTable />
          </Suspense>
        ),
      },
      SCHEDULE: {
        path: 'schedule',
        render: () => (
          <Suspense fallback={<Loading />}>
            <Schedule />
          </Suspense>
        ),
      },
      SETTINGS: {
        path: 'settings',
        render: () => (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
    },
  },
} as const;
