import type { TableCellBaseProps, TableCellProps } from '@mui/material';
import { TableCell, TableSortLabel } from '@mui/material';
import type { SortDirection } from '@vpo-help/model';

export type HeadTableCellProps = React.PropsWithChildren<{
  name: string;
  sortBy: string | undefined;
  sortDirection: SortDirection | undefined;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  onSort?: (
    name: string | undefined,
    direction: SortDirection | undefined,
  ) => void;
}>;

export const HeadTableCell: React.FC<HeadTableCellProps> = (props) => {
  const { name, sortBy, sortDirection, children, onSort, ...rest } = props;
  const isActive = sortBy === name;
  const direction = isActive
    ? sortDirection === 1
      ? 'asc'
      : 'desc'
    : undefined;
  return (
    <TableCell {...rest} sortDirection={direction}>
      <TableSortLabel
        active={isActive}
        direction={direction}
        onClick={() =>
          onSort?.(
            isActive && sortDirection === -1 ? undefined : name,
            isActive ? (sortDirection === 1 ? -1 : undefined) : 1,
          )
        }
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
};
