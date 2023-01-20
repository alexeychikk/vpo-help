import type { ButtonProps, SxProps } from '@mui/material';
import { Button } from '@mui/material';
import React from 'react';
import type { NavLinkProps } from '../NavLink';
import { NavLink } from '../NavLink';

export type NavLinkButtonProps = NavLinkProps &
  Omit<ButtonProps, 'href' | 'sx'> & { sxButton?: SxProps };

export const NavLinkButton: React.FC<NavLinkButtonProps> = ({
  activeOnlyWhenExact,
  icon,
  external,
  to,
  target,
  sx,
  sxButton,
  ...props
}) => {
  return (
    <NavLink
      activeOnlyWhenExact={activeOnlyWhenExact}
      icon={icon}
      external={external}
      to={to}
      target={target}
      sx={[{ typography: 'button' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Button sx={sxButton} {...props} />
    </NavLink>
  );
};
