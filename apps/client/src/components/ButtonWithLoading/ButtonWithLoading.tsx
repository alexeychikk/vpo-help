import type { ButtonProps } from '@mui/material';
import { Box, Button, CircularProgress } from '@mui/material';
import { blue } from '@mui/material/colors';

export type ButtonWithLoadingProps = ButtonProps & {
  loading: boolean;
};

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  loading,
  children,
  ...rest
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Button disabled={loading} {...rest}>
        {children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: blue[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};
