import type { BoxProps, ButtonProps } from '@mui/material';
import { Box, Button, CircularProgress } from '@mui/material';
import { blue } from '@mui/material/colors';

export type ButtonWithLoadingProps = ButtonProps & {
  component?: 'button' | 'label';
  loading: boolean;
  boxSx?: BoxProps['sx'];
};

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  loading,
  boxSx,
  children,
  ...rest
}) => {
  return (
    <Box sx={{ position: 'relative', ...boxSx }}>
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
