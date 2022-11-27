import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '../components';
import { ACCESS_TOKEN } from '../constants';
import { ROUTES } from '../routes';

const theme = createTheme();

export const App = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter>
          <Routes>
            {Object.values(ROUTES).map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.private ? (
                      <PrivateRoute
                        token={token}
                        redirectPath={ROUTES.LOGIN.path}
                        element={route.render()}
                      />
                    ) : (
                      route.render()
                    )
                  }
                />
              );
            })}
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
