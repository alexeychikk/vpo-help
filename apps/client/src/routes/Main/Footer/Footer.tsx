import { Adb as AdbIcon, Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { FOOTER } from '../../../constants';
import classes from './Footer.module.scss';

export const Footer = () => {
  const theme = useTheme();
  const addresses = '<b>Hello</b><br/>World';
  const schedule = '<b>Hello</b><br/>Schedule';

  return (
    <Container
      maxWidth={false}
      sx={{
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          pt: 6,
          pb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mr: { xs: 0, md: 3, lg: 6 },
            mb: { xs: 3, md: 0 },
          }}
        >
          <Typography variant="h4" mb={2}>
            {FOOTER.addresses}
          </Typography>
          <Typography component="div" variant="body1">
            <pre
              className={classes['pre']}
              dangerouslySetInnerHTML={{ __html: addresses }}
            />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" mb={2}>
            {FOOTER.schedule}
          </Typography>
          <Typography component="div" variant="body1">
            <pre
              className={classes['pre']}
              dangerouslySetInnerHTML={{ __html: schedule }}
            />
          </Typography>
        </Box>
      </Container>
    </Container>
  );
};
