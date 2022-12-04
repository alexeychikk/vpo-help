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

export const FOOTER = {
  addresses: 'Адреси центрів допомоги',
  addressesStub: 'Тут будуть адреси центрів допомоги ВПО',
  schedule: 'Графік роботи',
  scheduleStub: 'Тут буде графік роботи центрів допомоги ВПО',
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
  vpo: {
    title: 'Список ВПО',
    table: {
      vpoReferenceNumber: 'Номер довідки',
      vpoIssueDate: 'Дата видачі довідки',
      scheduleDate: 'Заброньований час',
      receivedHelpDate: 'Отримано допомогу',
      firstName: 'Ім‘я',
      lastName: 'Прізвище',
      middleName: 'По-батькові',
      phoneNumber: 'Телефон',
      dateOfBirth: 'Дата народження',
      addressOfRegistration: 'Місто згідно паспорту',
      addressOfResidence: 'Місто фактичного проживання',
      numberOfRelatives: 'Родичі',
      numberOfRelativesBelow16: 'Діти',
      numberOfRelativesAbove65: 'Літні люди',
      createAt: 'Дата реєстрації',
    },
    filters: {
      title: 'Фільтри',
      search: 'Повнотекстовый пошук',
      searchError: 'Для пошуку введіть не меньше 3 символів',
      minCreatedAt: 'Мінімальна дата реєстрації',
      maxCreatedAt: 'Максимальна дата реєстрації',
      minReceivedHelp: 'Мінімальна дата отримання допомоги',
      maxReceivedHelp: 'Максимальна дата отримання допомоги',
      reset: 'Скинути фільтри',
      apply: 'Застосувати фільтри',
    },
    export: {
      limit: 'Кількість записів',
      button: 'Експортувати',
      error: 'Помилка при експорті файла',
    },
    import: {
      file: 'Оберіть файл',
      button: 'Імпортувати файл',
      error: 'Виникла помилка для деяких записів при импорті файла',
    },
  },
  schedule: {
    title: 'Розклад',
  },
  settings: {
    title: 'Налаштування',
    form: {
      daysToNextVpoRegistration: 'Кількість днів до повторної реєстрації ВПО',
      endOfWarDate: 'Дата, до якої реєстрація доступна для ВПО',
      scheduleDaysAvailable:
        'Кількість днів, яка доступна на вибір для ВПО при реєстрації',
      addresses: FOOTER.addresses,
      schedule: FOOTER.schedule,
    },
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
    addressOfResidenceValue: 'Київ',
    addressOfResidence: 'Місто фактичного проживання (згідно Довідці ВПО)',
    addressOfResidenceHelper: 'Бронювання доступне тільки для Киева',
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
