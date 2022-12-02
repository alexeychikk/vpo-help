export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const ERROR_MESSAGES = {
  required: 'Має бути заповнене',
  requiredDate: 'Має бути датою формату ДД.ММ.РР',
  minLength: 'Недостатня кількість символів',
  maxLength: 'Перевищена кількість символів',
  min: 'Недостатня кількість',
  max: 'Перевищена кількість',
  pattern: 'Невірний формат',
  unknown:
    'Виникла невідома помилка. Зверніться за допомогою до адміністратора веб-ресурсу.',
};

export const LOGIN = {
  title: 'Вхід',
  button: 'Увійти',
  form: {
    email: 'Електронна пошта',
    password: 'Пароль',
  },
  error: 'Невірна пошта чи пароль',
};

export const MAIN = {
  separator: 'Або',
  findBooking: {
    title: 'Знайти бронювання за номером довідки ВПО',
    label: 'Номер довідки ВПО',
    button: 'Знайти',
    error: 'За таким номером довідки бронювання не знайдене',
  },
  startBooking: 'Забронювати місце в черзі',
  backToMain: 'Повернутися на головну',
};

export const ADMIN = {
  header: {
    pages: {
      VPO: 'Список ВПО',
      SCHEDULE: 'Розклад',
      SETTINGS: 'Налаштування',
    } as const,
  },
  schedule: {
    title: 'Розклад',
  },
  saveButton: 'Зберегти',
  errorModal: {
    title: 'Помилка',
    content:
      'Виникла помилка при збереженні данних. Перезавантажте сторінку та спробуйте знову. Якщо помилка повториться, зверніться за допомогою до адміністратора веб-ресурсу.',
    closeButton: 'Закрити',
  },
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
    phoneNumber: 'Номер телефону',
    dateOfBirth: 'Дата народження',
    addressOfRegistration: 'Місто реєстрації (згідно паспорту)',
    addressOfResidence: 'Місто фактичного проживання (згідно Довідці ВПО)',
    numberOfRelatives: 'Скільки членів вашої родини переїхали з вами?',
    numberOfRelativesBelow16: 'Скільки з них дітей до 16 років?',
    numberOfRelativesAbove65: 'Скільки з них дорослих, старшіх за 65 років?',
  },
  bookingInfoTitle: 'Ваше бронювання',
  peopleSuffix: 'ос.',
  errorModalTitle: 'Помилка бронювання',
  helpRestriction: {
    regexp: /Help can be received once in (\d+?) days/,
    getText: (days: number) =>
      `Ви вже отримували допомогу. Отримати допомогу повторно можливо раз у ${days} д.`,
  },
  errorMessages: {
    'Registration has been already scheduled':
      'Ви вже зареєстровані. Ви можете знайти інформацію про ваше бронювання на головній сторінці за номером довідки ВПО.',
    'Registration must be scheduled for the future':
      'Вибраний час бронювання не доступний. Перезавантажте сторінку та спробуйте знову.',
    'Slot with such time was not found in schedule':
      'Вибраний час бронювання не дійсний. Перезавантажте сторінку та спробуйте знову.',
    'Selected time slot is no longer available':
      'Вибраний час бронювання вже зайнятий. Перезавантажте сторінку та спробуйте знову.',
  } as Record<string, string>,
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
