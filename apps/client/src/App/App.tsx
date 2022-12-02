import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '../components';
import { ACCESS_TOKEN } from '../constants';
import { ROUTES } from '../routes';
import { authService } from '../services';

const theme = createTheme();

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'uk-UA'}>
        <BrowserRouter>
          <Routes>
            {Object.values(ROUTES).map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    'private' in route && route.private ? (
                      <PrivateRoute
                        getToken={authService.getToken}
                        redirectPath={ROUTES.LOGIN.path}
                        element={route.render()}
                      />
                    ) : (
                      route.render()
                    )
                  }
                >
                  {'subroutes' in route &&
                    Object.values(route.subroutes).map((subroute) => {
                      return (
                        <Route
                          key={subroute.path}
                          path={subroute.path}
                          element={subroute.render()}
                        />
                      );
                    })}
                </Route>
              );
            })}
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
