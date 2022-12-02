import type {
  AppointmentModel,
  ChangeSet,
} from '@devexpress/dx-react-scheduler';
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
import { useCallback } from 'react';
import type { Required } from 'utility-types';
import { AppointmentFormLayout } from './AppointmentFormLayout';
import { AppointmentTooltipContent } from './AppointmentTooltipContent';
import { DayScaleCell } from './DayScaleCell';

export type SchedulerProps<
  T extends Required<AppointmentModel, 'id' | 'startDate'>,
> = {
  schedule: T[];
  startDate: string;
  validate: (added: Omit<T, 'id'>) => boolean;
  generateNewId: (schedule: T[]) => T['id'];
  onChange: (newSchedule: T[]) => Promise<void> | void;
};

export const Scheduler = <
  T extends Required<AppointmentModel, 'id' | 'startDate'> = Required<
    AppointmentModel,
    'id' | 'startDate'
  >,
>({
  schedule,
  startDate,
  validate,
  generateNewId,
  onChange,
}: SchedulerProps<T>): React.ReactElement => {
  const handleCommitChanges = useCallback(
    async (changeSet: ChangeSet) => {
      const { added, changed, deleted } = changeSet as ScheduleChangeSet<T>;
      let newSchedule = schedule.slice();

      if (added && validate(added)) {
        const startingAddedId = generateNewId(newSchedule);
        newSchedule.push({ ...added, id: startingAddedId } as T);
      }

      if (changed) {
        newSchedule = newSchedule.map((slot) => {
          if (!changed[slot.id as T['id']]) {
            return slot;
          }
          return { ...slot, ...changed[slot.id as T['id']] };
        });
      }

      if (deleted !== undefined) {
        newSchedule = newSchedule.filter((slot) => slot.id !== deleted);
      }

      await onChange(newSchedule);
    },
    [schedule, generateNewId, validate, onChange],
  );

  console.log(schedule);

  return (
    <DevExpressScheduler
      data={schedule}
      height="auto"
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
  );
};

type ScheduleChangeSet<
  T extends Required<AppointmentModel, 'id' | 'startDate'>,
> = {
  added?: Omit<T, 'id'>;
  changed?: Record<T['id'], T>;
  deleted?: T['id'];
};
