export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const ERROR_MESSAGES = {
  required: 'Має бути заповнене',
  requiredDate: 'Має бути датою формату ДД.ММ.РР',
};

export const LOGIN = {
  title: 'Вхід',
  form: {
    email: 'Електронна пошта',
    password: 'Пароль',
  },
};

export const MAIN = {
  separator: 'Або',
  findBooking: {
    title: 'Знайти бронювання за номером довідки ВПО',
    label: 'Номер довідки ВПО',
    button: 'Знайти',
  },
  startBooking: 'Забронювати місце в черзі',
};

export const BOOKING = {
  title: 'Бронювання',
  stepper: [
    'Виберіть час бронювання',
    'Заповніть персональну інформацію',
    'Підтвердіть бронювання',
  ] as const,
  prevStep: 'Назад',
  nextStep: 'Вперед',
  gotoMain: 'На головну',
  confirmBuuton: 'Підтверджую',
  form: {
    scheduleDate: 'Дата та час, коли потрібно прибути до Центру допомоги',
    vpoIssueDate: 'Дата видачі довідки',
    vpoReferenceNumber: 'Номер довідки ВПО від 2022 року',
    firstName: 'Ім‘я',
    lastName: 'Прізвище',
    middleName: 'По-батькові',
    dateOfBirth: 'Дата народження',
    addressOfRegistration: 'Місто реєстрації (згідно паспорту)',
    addressOfResidence: 'Місто фактичного проживання (згідно Довідці ВПО)',
    numberOfRelatives: 'Скільки членів вашої родини переїхали з вами?',
    numberOfRelativesBelow16: 'Скільки з них дітей до 16 років?',
    numberOfRelativesAbove65: 'Скільки з них дорослих, старшіх за 65 років?',
  },
  bookingInfoTitle: 'Ваше бронювання',
  peopleSuffix: 'ос.',
};

export const SCHEDULER = {
  appointmentTooltip: {
    maxSlotCapacity: 'Максимальна кількість реєстрацій',
  },
  appointmentForm: {
    startDate: 'Початок прийому',
    endDate: 'Кінець прийому',
    maxSlotCapacity: 'Максимальна кількість реєстрацій',
  },
};

export const FOOTER = {
  addresses: 'Адреси центрів допомоги',
  schedule: 'Графік роботи',
};
