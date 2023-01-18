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
import { useCallback, useEffect, useState } from 'react';
import type { Required } from 'utility-types';
import { AppointmentContent } from './AppointmentContent';
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

const HEIGHT_OFFSET = 250;

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
  const [height, setHeight] = useState(window.innerHeight - HEIGHT_OFFSET);
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newHeight = window.innerHeight - HEIGHT_OFFSET;
        if (height !== newHeight) setHeight(newHeight);
      }, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DevExpressScheduler
      data={schedule}
      height={height}
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
      <Appointments appointmentContentComponent={AppointmentContent} />
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
