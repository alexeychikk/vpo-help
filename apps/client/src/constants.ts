export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const ERROR_MESSAGES = {
  required: 'Має бути заповнене',
  requiredDate: 'Має бути датою формату ДД.ММ.РР',
  minLength: 'Недостатня кількість символів',
  maxLength: 'Перевищена кількість символів',
  min: 'Недостатня кількість',
  max: 'Перевищена кількість',
  email: 'Формат має бути email@example.com',
  patternPhone: 'Формат має бути +380XXXXXXXXX',
  patternVpoReferenceNumber: 'Формат має бути 0000-0000000000',
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
    logout: 'Вийти',
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
    pagination: {
      prevPage: 'На минулу сторінку',
      nextPage: 'На попередню сторінку',
      rowsPerPage: 'Записів на сторінку:',
      of: 'з',
      moreThan: 'більше ніж',
    },
    filters: {
      title: 'Фільтри',
      search: 'Повнотекстовий пошук',
      searchError: 'Для пошуку введіть не меньше 3 символів',
      scheduleDate: 'Заброньована дата',
      minReceivedHelp: 'Мін. дата отримання допомоги',
      maxReceivedHelp: 'Макс. дата отримання допомоги',
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
  close: 'Закрити',
  prevStep: 'Назад',
  nextStep: 'Вперед',
  gotoMain: 'На головну',
  confirmButton: 'Підтверджую',
  sendVerification: 'Відправити код підтвердження',
  resendVerification: 'Повторно відправити код підтвердження',
  verificationTitle: 'Код підтвердження було відправлено на пошту',
  form: {
    email: 'Електронна пошта',
    verificationCode: 'Код підтвердження',
    verificationCodeHelper: 'Якщо не знайшли листа, перевірте папку "Спам"',
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
    addressOfResidenceError: 'Бронювання доступне тільки для Києва',
    addressOfResidenceOptions: ['Київ', 'Інше місто'],
    addressOfResidence: 'Місто фактичного проживання (згідно Довідці ВПО)',
    addressOfResidenceHelper: 'Бронювання доступне тільки для Києва',
    numberOfRelatives: 'Скільки членів вашої родини переїхали з вами?',
    numberOfRelativesBelow16: 'Скільки з них дітей до 16 років?',
    numberOfRelativesAbove65: 'Скільки з них дорослих, старшіх за 65 років?',
  },
  hint: 'Примітка: реєстрація одного члена сім‘ї означає, що ви зареєстрували в черзі усю сім‘ю.',
  bookingInfoTitle: 'Ваше бронювання',
  peopleSuffix: 'ос.',
  errorModalTitle: 'Помилка бронювання',
  verificationRestriction: {
    regexp: /Verification code can be sent once in (\d+?) seconds/,
    getText: (seconds: number) =>
      `Відправити код повторно можливо раз у ${seconds} сек.`,
  },
  helpRestriction: {
    regexp: /Help can be received once in (\d+?) days/,
    getText: (days: number) =>
      `Ви вже отримували допомогу. Отримати допомогу повторно можливо раз у ${days} д.`,
  },
  errorMessages: {
    verificationCode: 'Введенно невірний код підтвердження.',
    verificationCodeLength: 'Код підтвердження має містити 6 символів.',
    'Registration has been already scheduled':
      'Ви вже зареєстровані. Ви можете знайти інформацію про ваше бронювання на головній сторінці за номером довідки ВПО.',
    'Slot with such time was not found in schedule':
      'Вибраний час бронювання не дійсний. Перезавантажте сторінку та спробуйте знову.',
    'Selected time slot is no longer available':
      'Вибраний час бронювання вже зайнятий. Перезавантажте сторінку та спробуйте знову.',
    'minimal allowed date for vpoIssueDate is 2022-01-01':
      'Бронювання можливе тільки для власників довідок ВПО від 2022 року.',
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
