import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AxiosError } from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import type { SortDirection } from '@vpo-help/model';
import { ButtonWithLoading } from '../../../components/ButtonWithLoading';
import { ACCESS_TOKEN, ADMIN, ERROR_MESSAGES } from '../../../constants';
import { vpoService } from '../../../services';
import { formatISOEndOfDay, formatISOStartOfDay } from '../../../utils';
import { ROUTES } from '../../routes.config';
import { HeadTableCell } from './HeadTableCell';

export const VpoTable: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [exportLimit, setExportLimit] = useState(1000);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>('scheduleDate');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    -1,
  );
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>();
  const [scheduleDateFilter, setScheduleDateFilter] = useState<string>();
  const [minReceivedHelpFilter, setMinReceivedHelpFilter] = useState<string>();
  const [maxReceivedHelpFilter, setMaxReceivedHelpFilter] = useState<string>();

  const vpoResponse = useAsync(async () => {
    let sort: Record<string, number> | undefined;

    if (sortBy && sortDirection) {
      sort = { [`sort[${sortBy}]`]: sortDirection, 'sort[createdAt]': -1 };
    }

    return vpoService.getPaginated({
      page: page + 1,
      limit,
      ...sort,
      ...filters,
    });
  }, [page, limit, sortBy, sortDirection, filters]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => setPage(newPage);

  const handleLimitChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => setLimit(parseInt(event.target.value) || 10);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setSearch(event.target.value);
  };

  const handleScheduleDateFilterChange = (date: moment.Moment | null) => {
    setScheduleDateFilter(date?.toISOString() || undefined);
  };

  const handleMinReceivedHelpFilterChange = (date: moment.Moment | null) => {
    setMinReceivedHelpFilter(date?.toISOString() || undefined);
  };

  const handleMaxReceivedHelpFilterChange = (date: moment.Moment | null) => {
    setMaxReceivedHelpFilter(date?.toISOString() || undefined);
  };

  if (vpoResponse.error) {
    if (
      vpoResponse.error instanceof AxiosError &&
      vpoResponse.error.response?.status === 401
    ) {
      return <Navigate to={ROUTES.LOGIN.path} />;
    }
    console.error(vpoResponse.error.stack || vpoResponse.error);
    return <Typography variant="h3">{ERROR_MESSAGES.unknown}</Typography>;
  }

  const handleSortChange = (
    column: string | undefined,
    direction: SortDirection | undefined,
  ) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const resetFilters = () => {
    setSearch(undefined);
    setScheduleDateFilter(undefined);
    setMinReceivedHelpFilter(undefined);
    setMaxReceivedHelpFilter(undefined);
    setFilters({});
    setPage(0);
  };

  const applyFilters = () => {
    const newFilters: Record<string, string> = {};
    const minScheduleDateKey = 'min[scheduleDate]';
    const maxScheduleDateKey = 'max[scheduleDate]';
    const minReceivedHelpKey = 'min-[receivedHelpDate]';
    const maxReceivedHelpKey = 'max-[receivedHelpDate]';

    if (search && search.length >= 3) {
      newFilters['q'] = search;
    }
    if (scheduleDateFilter) {
      newFilters[minScheduleDateKey] = formatISOStartOfDay(scheduleDateFilter)!;
      newFilters[maxScheduleDateKey] = formatISOEndOfDay(scheduleDateFilter)!;
    }
    if (minReceivedHelpFilter) {
      newFilters[minReceivedHelpKey] = formatISOStartOfDay(
        minReceivedHelpFilter,
      )!;
    }
    if (maxReceivedHelpFilter) {
      newFilters[maxReceivedHelpKey] = formatISOEndOfDay(
        maxReceivedHelpFilter,
      )!;
    }

    if (
      filters['q'] !== newFilters['q'] ||
      filters[minScheduleDateKey] !== newFilters[minScheduleDateKey] ||
      filters[maxScheduleDateKey] !== newFilters[maxScheduleDateKey] ||
      filters[minReceivedHelpKey] !== newFilters[minReceivedHelpKey] ||
      filters[maxReceivedHelpKey] !== newFilters[maxReceivedHelpKey]
    ) {
      setFilters(newFilters);
      setPage(0);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      let sort: Record<string, number> | undefined;

      if (sortBy && sortDirection) {
        sort = { [`sort[${sortBy}]`]: sortDirection, 'sort[createdAt]': -1 };
      }

      await vpoService.downloadVpoList({
        page: 1,
        limit: exportLimit || 1000,
        ...sort,
        ...filters,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          return navigate(ROUTES.LOGIN.path, { replace: true });
        }
      }
      setErrorMessage(ADMIN.vpo.export.error);
      setIsModalOpen(true);
    }
    setExportLoading(false);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setImportLoading(true);
      const data = await vpoService.uploadFile(file);

      if (data.failed?.length) {
        setErrorMessage(`${ADMIN.vpo.import.error} - ${data.failed}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          return navigate(ROUTES.LOGIN.path, { replace: true });
        }
      }
      setIsModalOpen(true);
    }
    setImportLoading(false);
  };

  const handleCloseModal = () => {
    setErrorMessage('');
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mb: 3 }}>
      <Paper>
        {vpoResponse.loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 30px)',
            }}
          >
            <CircularProgress size={50} />
          </Box>
        ) : (
          <>
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
              {ADMIN.vpo.title}
            </Typography>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', mx: 2, mb: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {ADMIN.vpo.filters.title}
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
                <TextField
                  name="search"
                  label={ADMIN.vpo.filters.search}
                  value={search || ''}
                  error={!!search && search.length < 3}
                  helperText={
                    search && search.length < 3
                      ? ADMIN.vpo.filters.searchError
                      : undefined
                  }
                  onChange={handleSearchChange}
                  sx={{ width: { xs: '100%', md: '250px' } }}
                />
                <DesktopDatePicker
                  ignoreInvalidInputs
                  label={ADMIN.vpo.filters.scheduleDate}
                  value={scheduleDateFilter || null}
                  inputFormat="DD.MM.YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: { xs: '100%', md: '250px' } }}
                    />
                  )}
                  onChange={handleScheduleDateFilterChange}
                />
                <DesktopDatePicker
                  ignoreInvalidInputs
                  label={ADMIN.vpo.filters.minReceivedHelp}
                  value={minReceivedHelpFilter || null}
                  inputFormat="DD.MM.YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: { xs: '100%', md: '320px' } }}
                    />
                  )}
                  onChange={handleMinReceivedHelpFilterChange}
                />
                <DesktopDatePicker
                  ignoreInvalidInputs
                  label={ADMIN.vpo.filters.maxReceivedHelp}
                  value={maxReceivedHelpFilter || null}
                  inputFormat="DD.MM.YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: { xs: '100%', md: '320px' } }}
                    />
                  )}
                  onChange={handleMaxReceivedHelpFilterChange}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={applyFilters}>
                  {ADMIN.vpo.filters.apply}
                </Button>
                <Button variant="outlined" onClick={resetFilters}>
                  {ADMIN.vpo.filters.reset}
                </Button>
              </Stack>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 650, mb: 2, mx: 2 }} size="small">
                <TableHead>
                  <TableRow>
                    <HeadTableCell
                      name="vpoReferenceNumber"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.vpoReferenceNumber}
                    </HeadTableCell>
                    <HeadTableCell
                      name="vpoIssueDate"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.vpoIssueDate}
                    </HeadTableCell>
                    <HeadTableCell
                      name="scheduleDate"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.scheduleDate}
                    </HeadTableCell>
                    <HeadTableCell
                      name="receivedHelpDate"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.receivedHelpDate}
                    </HeadTableCell>
                    <HeadTableCell
                      name="lastName"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.lastName}
                    </HeadTableCell>
                    <HeadTableCell
                      name="firstName"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.firstName}
                    </HeadTableCell>
                    <HeadTableCell
                      name="middleName"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.middleName}
                    </HeadTableCell>
                    <HeadTableCell
                      name="dateOfBirth"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.dateOfBirth}
                    </HeadTableCell>
                    <HeadTableCell
                      name="phoneNumber"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.phoneNumber}
                    </HeadTableCell>
                    <HeadTableCell
                      name="email"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.email}
                    </HeadTableCell>
                    <HeadTableCell
                      name="addressOfRegistration"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.addressOfRegistration}
                    </HeadTableCell>
                    <HeadTableCell
                      name="addressOfResidence"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                    >
                      {ADMIN.vpo.table.addressOfResidence}
                    </HeadTableCell>
                    <HeadTableCell
                      name="numberOfRelatives"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                      align="right"
                    >
                      {ADMIN.vpo.table.numberOfRelatives}
                    </HeadTableCell>
                    <HeadTableCell
                      name="numberOfRelativesBelow16"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                      align="right"
                    >
                      {ADMIN.vpo.table.numberOfRelativesBelow16}
                    </HeadTableCell>
                    <HeadTableCell
                      name="numberOfRelativesAbove65"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSortChange}
                      align="right"
                    >
                      {ADMIN.vpo.table.numberOfRelativesAbove65}
                    </HeadTableCell>
                    <HeadTableCell
                      name="createAt"
                      sortBy="createAt"
                      sortDirection={-1}
                    >
                      {ADMIN.vpo.table.createAt}
                    </HeadTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vpoResponse.value?.items.map((row) => (
                    <TableRow
                      key={row.vpoReferenceNumber}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.vpoReferenceNumber}</TableCell>
                      <TableCell>
                        {moment(row.vpoIssueDate).format('DD.MM.YYYY')}
                      </TableCell>
                      <TableCell>
                        {moment(row.scheduleDate).format('HH:mm - DD.MM.YYYY')}
                      </TableCell>
                      <TableCell>
                        {row.receivedHelpDate
                          ? moment(row.receivedHelpDate).format('DD.MM.YYYY')
                          : '-'}
                      </TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.middleName}</TableCell>
                      <TableCell>
                        {moment(row.dateOfBirth).format('DD.MM.YYYY')}
                      </TableCell>
                      <TableCell>{row.phoneNumber || '-'}</TableCell>
                      <TableCell>{row.email || '-'}</TableCell>
                      <TableCell>{row.addressOfRegistration}</TableCell>
                      <TableCell>{row.addressOfResidence}</TableCell>
                      <TableCell align="right">
                        {row.numberOfRelatives || '-'}
                      </TableCell>
                      <TableCell align="right">
                        {row.numberOfRelativesBelow16 || '-'}
                      </TableCell>
                      <TableCell align="right">
                        {row.numberOfRelativesAbove65 || '-'}
                      </TableCell>
                      <TableCell>
                        {moment(row.createdAt).format('DD.MM.YYYY')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[10, 25, 50, 100]}
              count={vpoResponse.value?.totalItems || 0}
              rowsPerPage={limit}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              backIconButtonProps={{
                title: ADMIN.vpo.pagination.prevPage,
                'aria-label': ADMIN.vpo.pagination.prevPage,
              }}
              nextIconButtonProps={{
                title: ADMIN.vpo.pagination.nextPage,
                'aria-label': ADMIN.vpo.pagination.nextPage,
              }}
              labelRowsPerPage={ADMIN.vpo.pagination.rowsPerPage}
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}–${to} ${ADMIN.vpo.pagination.of} ${
                  count !== -1
                    ? count
                    : `${ADMIN.vpo.pagination.moreThan} ${to}`
                }`;
              }}
              sx={{
                display: 'flex',
                justifyContent: 'end',
              }}
            />
            <Box p={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} pb={2}>
                <TextField
                  type="number"
                  name="exportLimit"
                  label={ADMIN.vpo.export.limit}
                  value={exportLimit || 0}
                  onChange={(event) => {
                    setExportLimit(parseInt(event.target.value) || 0);
                  }}
                />
                <ButtonWithLoading
                  variant="contained"
                  loading={exportLoading}
                  disabled={!vpoResponse.value?.totalItems}
                  onClick={handleExport}
                  sx={{ height: '100%', width: { xs: '100%' } }}
                >
                  {ADMIN.vpo.export.button}
                </ButtonWithLoading>
                <ButtonWithLoading
                  component="label"
                  variant="contained"
                  loading={importLoading}
                  sx={{ height: '100%', width: { xs: '100%' } }}
                >
                  {ADMIN.vpo.import.button}
                  <input
                    type="file"
                    name="import"
                    accept="text/csv"
                    hidden
                    onChange={handleImport}
                  />
                </ButtonWithLoading>
              </Stack>
            </Box>
          </>
        )}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle id="alert-dialog-title">
            {ADMIN.errorModal.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorMessage || ADMIN.errorModal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="contained" autoFocus>
              {ADMIN.errorModal.closeButton}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};
