import type { ChangeSet } from '@devexpress/dx-react-scheduler';
import {
  EditingState,
  IntegratedEditing,
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  Scheduler as DevExpressScheduler,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Paper } from '@mui/material';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { AppointmentFormLayout } from './AppointmentFormLayout';
import { AppointmentTooltipContent } from './AppointmentTooltipContent';
import { DayScaleCell } from './DayScaleCell';

const startDate = '2022-11-21';

export type SchedulerProps = Record<string, never>;

export const Scheduler: React.FC<SchedulerProps> = () => {
  const [schedule, setSchedule] = useState<ScheduleSlotModel[]>([
    {
      id: 0,
      startDate: moment(startDate)
        .add(1, 'day')
        .hours(12)
        .minutes(20)
        .valueOf(),
      endDate: moment(startDate).add(1, 'day').hours(16).minutes(0).valueOf(),
      numberOfPersons: 40,
    },
  ]);

  const handleCommitChanges = useCallback((changeSet: ChangeSet) => {
    const { added, changed, deleted } = changeSet as ScheduleChangeSet;

    setSchedule((data) => {
      const newSchedule = data.slice();

      if (added && added.startDate && added.endDate && added.numberOfPersons) {
        const startingAddedId = data.length ? data[data.length - 1].id + 1 : 0;
        newSchedule.push({ ...added, id: startingAddedId });
      }

      if (changed) {
        newSchedule.forEach((slot) => {
          if (
            !changed[slot.id] ||
            !changed[slot.id].startDate ||
            !changed[slot.id].endDate ||
            !!changed[slot.id].numberOfPersons
          )
            return;
        });
      }

      if (deleted !== undefined) {
        return newSchedule.filter((slot) => slot.id !== deleted);
      }
      return newSchedule;
    });
  }, []);

  return (
    <Paper>
      <DevExpressScheduler
        data={schedule}
        height={660}
        locale={'uk-UA'}
        firstDayOfWeek={1}
      >
        <ViewState currentDate={startDate} />
        <EditingState onCommitChanges={handleCommitChanges} />
        <IntegratedEditing />
        <WeekView
          startDayHour={8}
          endDayHour={20}
          cellDuration={30}
          dayScaleCellComponent={DayScaleCell}
        />
        <Appointments />
        <AppointmentTooltip
          showCloseButton
          showOpenButton
          showDeleteButton
          contentComponent={AppointmentTooltipContent}
        />
        <AppointmentForm basicLayoutComponent={AppointmentFormLayout} />
      </DevExpressScheduler>
    </Paper>
  );
};

type ScheduleSlotModel = {
  id: number;
  startDate: number;
  endDate: number;
  numberOfPersons: number;
};

type ScheduleChangeSet = {
  added?: Omit<ScheduleSlotModel, 'id'>;
  changed?: Record<number, ScheduleSlotModel>;
  deleted?: number;
};
