import React from 'react';
import { Booking } from './Booking';
import { Main } from './Main';

const Admin = React.lazy(() => import('./Admin'));
const Schedule = React.lazy(() => import('./Admin/Schedule'));
const Settings = React.lazy(() => import('./Admin/Settings'));
const VpoTable = React.lazy(() => import('./Admin/VpoTable'));
const Login = React.lazy(() => import('./Login'));

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
    render: () => <Login />,
  },
  ADMIN: {
    path: '/admin',
    private: true,
    render: () => <Admin />,
    subroutes: {
      VPO_INDEX: {
        path: '',
        render: () => <VpoTable />,
      },
      VPO: {
        path: 'vpo',
        render: () => <VpoTable />,
      },
      SCHEDULE: {
        path: 'schedule',
        render: () => <Schedule />,
      },
      SETTINGS: {
        path: 'settings',
        render: () => <Settings />,
      },
    },
  },
} as const;
