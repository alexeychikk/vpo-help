import React from 'react';
import { Admin } from './Admin';
import { Booking } from './Booking';
import { Login } from './Login';
import { Main } from './Main';

export enum Routes {
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN',
  MAIN = 'MAIN',
  BOOKING = 'BOOKING',
}

export const ROUTES: Record<Routes, Route> = {
  [Routes.MAIN]: {
    path: '/',
    render: () => <Main />,
  },
  [Routes.BOOKING]: {
    path: '/booking',
    render: () => <Booking />,
  },
  [Routes.LOGIN]: {
    path: '/login',
    render: () => <Login />,
  },
  [Routes.ADMIN]: {
    path: '/admin',
    private: true,
    render: () => <Admin />,
  },
};

export type Route = {
  path: string;
  private?: boolean;
  render: () => React.ReactElement;
};
