import SaveIcon from '@mui/icons-material/Save';
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
  Fab,
  Paper,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import type { Optional } from 'utility-types';
import type { ScheduleDto } from '@vpo-help/model';
import { Scheduler } from '../../../components/Scheduler';
import { ACCESS_TOKEN, ADMIN, ERROR_MESSAGES } from '../../../constants';
import { scheduleService } from '../../../services';
import { ROUTES } from '../../routes.config';

const startDate = '2022-11-21';

export const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [scheduleCache, setScheduleCache] = useState<ScheduleSlot[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isScheduleChanged, setIsScheduleChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scheduleResponse = useAsync(async () => {
    const schedule = await scheduleService.getSchedule();
    let idCounter = 0;
    return Object.entries(schedule).reduce((acc, [dayNumber, slots]) => {
      slots.forEach((slot) => {
        const [hoursFrom, minutesFrom] = slot.timeFrom
          .split(':')
          .map((item) => parseInt(item));
        const [hoursTo, minutesTo] = slot.timeTo
          .split(':')
          .map((item) => parseInt(item));

        acc.push({
          id: ++idCounter,
          startDate: moment(startDate)
            .add(dayNumber, 'days')
            .hours(hoursFrom)
            .minutes(minutesFrom)
            .format(),
          endDate: moment(startDate)
            .add(dayNumber, 'days')
            .hours(hoursTo)
            .minutes(minutesTo)
            .format(),
          numberOfPersons: slot.numberOfPersons,
        });
      });
      return acc;
    }, [] as ScheduleSlot[]);
  });

  const saveSchedule = useCallback(async () => {
    if (!scheduleCache) return;
    try {
      setLoading(true);
      await scheduleService.saveSchedule(
        scheduleCache.reduce((acc, slot) => {
          const key = moment(slot.startDate).weekday() as keyof ScheduleDto;
          acc[key] ??= [];
          acc[key].push({
            timeFrom: moment(slot.startDate).format('HH:mm'),
            timeTo: moment(slot.endDate).format('HH:mm'),
            numberOfPersons: slot.numberOfPersons,
          });
          return acc;
        }, {} as ScheduleDto),
      );
      setIsScheduleChanged(false);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          return navigate(ROUTES.LOGIN.path, { replace: true });
        }

        setIsModalOpen(true);
      }
    }
  }, [scheduleCache, navigate]);

  const cacheSchedule = useCallback((newSchedule: ScheduleSlot[]) => {
    setIsScheduleChanged(true);
    setScheduleCache(newSchedule);
  }, []);

  const validateNewSlot = useCallback((slot: Optional<ScheduleSlot>) => {
    return !!(
      slot.startDate &&
      slot.endDate &&
      slot.numberOfPersons &&
      slot.numberOfPersons < 10000 &&
      moment(slot.startDate).isBefore(moment(slot.endDate))
    );
  }, []);

  const generateNewId = useCallback((schedule: ScheduleSlot[]) => {
    return schedule.length ? schedule[schedule.length - 1].id + 1 : 0;
  }, []);

  if (scheduleResponse.error) {
    if (
      scheduleResponse.error instanceof AxiosError &&
      scheduleResponse.error.response?.status === 401
    ) {
      return <Navigate to={ROUTES.LOGIN.path} />;
    }
    console.error(scheduleResponse.error.stack || scheduleResponse.error);
    return <Typography variant="h3">{ERROR_MESSAGES.unknown}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Paper sx={{ mb: 3, p: 2 }}>
        {scheduleResponse.loading || loading ? (
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
              {ADMIN.schedule.title}
            </Typography>
            <Scheduler
              schedule={scheduleCache || scheduleResponse.value!}
              startDate={startDate}
              validate={validateNewSlot}
              generateNewId={generateNewId}
              onChange={cacheSchedule}
            />
            <Fab
              color="primary"
              title={ADMIN.saveButton}
              disabled={!isScheduleChanged}
              sx={{
                position: 'fixed',
                top: 'calc(100vh - 72px)',
                left: 'calc(100vw - 72px)',
              }}
              onClick={saveSchedule}
            >
              <SaveIcon />
            </Fab>
          </>
        )}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle id="alert-dialog-title">
            {ADMIN.errorModal.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {ADMIN.errorModal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="contained"
              autoFocus
            >
              {ADMIN.errorModal.closeButton}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export type ScheduleSlot = {
  id: number;
  startDate: string;
  endDate: string;
  numberOfPersons: number;
};
