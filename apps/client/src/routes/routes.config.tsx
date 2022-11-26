import React from 'react';
import { Admin } from './Admin';
import { Login } from './Login';
import { Main } from './Main';

export enum Routes {
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN',
  MAIN = 'MAIN',
}

export const ROUTES: Record<Routes, Route> = {
  [Routes.ADMIN]: {
    path: '/admin',
    private: true,
    render: () => <Admin />,
  },
  [Routes.LOGIN]: {
    path: '/login',
    render: () => <Login />,
  },
  [Routes.MAIN]: {
    path: '/',
    render: () => <Main />,
  },
};

export type Route = {
  path: string;
  private?: boolean;
  render: () => React.ReactElement;
};
