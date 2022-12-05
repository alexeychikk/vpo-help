import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { ACCESS_TOKEN, ADMIN } from '../../../constants';
import { ROUTES } from '../../routes.config';

const pages = [
  {
    href: '/admin/vpo',
    label: ADMIN.header.pages.VPO,
  },
  {
    href: '/admin/schedule',
    label: ADMIN.header.pages.SCHEDULE,
  },
  {
    href: '/admin/settings',
    label: ADMIN.header.pages.SETTINGS,
  },
];

export const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.href}>
                  <Button
                    key={page.href}
                    href={page.href}
                    component="a"
                    sx={{ color: 'black' }}
                  >
                    {page.label}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.href}
                href={page.href}
                sx={{ m: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Button
            sx={{ color: 'white' }}
            href={ROUTES.LOGIN.path}
            onClick={handleLogout}
          >
            {ADMIN.header.logout}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
