import type { SvgIcon, SxProps } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link, useMatch } from 'react-router-dom';

export type NavLinkProps = {
  activeOnlyWhenExact?: boolean;
  children: React.ReactNode;
  icon?: typeof SvgIcon;
  external?: boolean;
  to: string;
  target?: LinkProps['target'];
  sx?: SxProps;
};

export const NavLink: React.FC<NavLinkProps> = (props) => {
  const match = useMatch({
    path: props.to,
    end: props.activeOnlyWhenExact,
  });
  const Icon = props.icon;
  const Component = props.external ? 'a' : Link;

  return (
    <Box
      component={Component}
      sx={[
        {
          display: 'inline-flex',
          textDecoration: 'none',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
      target={props.target}
      {...(props.external ? { href: props.to } : { to: props.to })}
    >
      {Icon && <Icon sx={{ mr: 1 }} />}
      {props.children}
    </Box>
  );
};
