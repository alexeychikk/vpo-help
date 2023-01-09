import { Box, Container, Typography, useTheme } from '@mui/material';
import { useAsync } from 'react-use';
import { FOOTER } from '../../../constants';
import { htmlService } from '../../../services';

export const Footer: React.FC = () => {
  const theme = useTheme();

  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    return info.content;
  });

  if (infoResponse.loading) return null;

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
              dangerouslySetInnerHTML={{
                __html:
                  infoResponse.value?.['addresses'] || FOOTER.addressesStub,
              }}
            />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" mb={2}>
            {FOOTER.schedule}
          </Typography>
          <Typography component="div" variant="body1">
            <pre
              dangerouslySetInnerHTML={{
                __html: infoResponse.value?.['schedule'] || FOOTER.scheduleStub,
              }}
            />
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            mt: { xs: 3, md: 0 },
            ml: { xs: 0, md: 3, lg: 6 },
            maxWidth: { xs: 'none', md: '400px' },
          }}
        >
          {FOOTER.bookingInfo}
        </Typography>
      </Container>
    </Container>
  );
};
