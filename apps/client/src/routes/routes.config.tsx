import { Admin } from './Admin';
import { Schedule } from './Admin/Schedule';
import { Settings } from './Admin/Settings';
import { VpoTable } from './Admin/VpoTable';
import { Booking } from './Booking';
import { Login } from './Login';
import { Main } from './Main';

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
