import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import React from 'react';
import { NavLink } from '../../../components/NavLink';
import { NavLinkButton } from '../../../components/NavLinkButton';
import { ACCESS_TOKEN, ADMIN } from '../../../constants';
import { ROUTES } from '../../routes.config';

const pages = [
  {
    to: '/admin/vpo',
    label: ADMIN.header.pages.VPO,
  },
  {
    to: '/admin/schedule',
    label: ADMIN.header.pages.SCHEDULE,
  },
  {
    to: '/admin/settings',
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
                <MenuItem key={page.to}>
                  <NavLink
                    key={page.to}
                    to={page.to}
                    sx={{ typography: 'button', color: 'black' }}
                  >
                    {page.label}
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NavLinkButton
                key={page.to}
                to={page.to}
                sx={{ m: 2, display: 'block' }}
                sxButton={{ color: 'white' }}
              >
                {page.label}
              </NavLinkButton>
            ))}
          </Box>
          <NavLinkButton
            sxButton={{ color: 'white' }}
            to={ROUTES.LOGIN.path}
            onClick={handleLogout}
          >
            {ADMIN.header.logout}
          </NavLinkButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
