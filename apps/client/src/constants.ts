import type { SettingsDto, VpoUserModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { dateLoader, nextDayLoader } from './utils';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const ERROR_MESSAGES = {
  required: 'Має бути заповнене',
  requiredDate: 'Має бути датою формату ДД.ММ.РРРР',
  minLength: 'Недостатня кількість символів',
  maxLength: 'Перевищена кількість символів',
  min: 'Недостатня кількість',
  max: 'Перевищена кількість',
  email: 'Формат має бути email@example.com',
  patternPhone: 'Формат має бути +380XXXXXXXXX',
  patternVpoReferenceNumber: 'Формат має бути 0000-0000000000',
  unknown:
    'Виникла невідома помилка. Зверніться за допомогою до адміністратора веб-ресурсу.',
  overload:
    'В даний час сервіс перенавантажено. Вибачаємось за незручності, спробуйте пізніше.',
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
  details: 'Додаткова інформація',
};

const TIME_SLOT_ERRORS = {
  slotMissed: 'Slot with such time was not found in schedule',
  slotBooked: 'Selected time slot is no longer available',
};

export const BOOKING = {
  title: 'Бронювання',
  finishTitle: 'Вас зареєстровано',
  stepper: [
    'Інформація',
    'Виберіть час бронювання',
    'Заповніть персональну інформацію',
    'Підтвердіть бронювання',
  ] as const,
  close: 'Закрити',
  prevStep: 'Назад',
  nextStep: 'Вперед',
  gotoMain: 'На головну',
  confirmButton: 'Підтверджую',
  addRelative: 'Додати дані родича',
  removeRelative: 'Видалити дані родича',
  accordionTitlePrefix: 'Ваші дані',
  accordionRelativeTitlePrefix: 'Дані родича зі справкою №',
  sendVerification: 'Відправити код підтвердження',
  resendVerification: 'Повторно відправити код підтвердження',
  verificationTitle: 'Код підтвердження було відправлено на пошту',
  chooseAnotherTime: 'Вибрати інший час',
  form: {
    email: 'Електронна пошта',
    verificationCode: 'Код підтвердження',
    verificationCodeHelper: 'Якщо не знайшли листа, перевірте папку "Спам"',
    scheduleDate:
      'Дата та час, коли потрібно прибути до Центру підтримки людей зі статусом ВПО «Життєлюб піклується»',
    vpoIssueDate: 'Дата видачі довідки',
    vpoIssueMinDateError:
      'Бронювання доступне тільки з довідкою виданою після 24.02.2022',
    vpoIssueMaxDateError: 'Дата повинна бути в минулому',
    vpoReferenceNumber: 'Номер довідки ВПО від 2022 року',
    vpoReferenceNumberHelper: '0000-0000000000',
    firstName: 'Ім‘я',
    lastName: 'Прізвище',
    middleName: 'По батькові',
    taxIdNumber: 'РНОКПП (ІПН)',
    taxIdNumberError: 'РНОКПП має складатися з 10 цифр',
    phoneNumber: 'Номер телефону',
    dateOfBirth: 'Дата народження',
    addressOfRegistration: 'Місце реєстрації (за паспортом)',
    addressOfResidenceValue: 'Київ',
    addressOfResidenceError: 'Бронювання доступне тільки для Києва',
    addressOfResidenceOptions: ['Київ', 'Інше місто'],
    addressOfResidence: 'Місто фактичного проживання (згідно з довідкою ВПО)',
    addressOfResidenceHelper:
      '​Бронювання доступне тільки для зареєстрованих у Києві',
    numberOfRelatives: 'Скільки членів вашої родини переїхали з вами?',
    numberOfRelativesHelper: 'Дані родичів потрібно додати нижче',
    numberOfRelativesBelow16: 'Скільки з них дітей до 16 років?',
    numberOfRelativesAbove65: 'Скільки з них дорослих, старших за 65 років?',
  },
  hint: 'Примітка: реєстрація одного члена сім‘ї означає, що ви зареєстрували в черзі усю сім‘ю.',
  bookingInfoTitle: 'Ваше бронювання (для одного або сім‘ї)',
  bookingInfoReferenceNumbers: 'Зареєстровані довідки: ',
  helpReceived: (
    settings: Partial<Serialized<SettingsDto>> = {},
    user: Partial<Serialized<VpoUserModel>> = {},
  ) =>
    `Ви вже отримали допомогу ${dateLoader(
      user.receivedHelpDate,
    )}. Отримати допомогу повторно можливо не раніше, ніж ${nextDayLoader(
      settings.daysToNextVpoRegistration && user.receivedHelpDate
        ? user.receivedHelpDate
        : undefined,
      settings.daysToNextVpoRegistration,
    )}.`,
  bookingExpired: (settings: Partial<Serialized<SettingsDto>> = {}) =>
    `Дата, на яку ви зареєструвались, минула.
Ви можете забронювати нову дату та час відвідин Центру після ${nextDayLoader(
      settings.endOfRegistrationDate,
    )}.`,
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
    [TIME_SLOT_ERRORS.slotMissed]:
      'Вибраний час бронювання не дійсний. Спробуйте вибрати інший час.',
    [TIME_SLOT_ERRORS.slotBooked]:
      'Вибраний час бронювання вже зайнятий. Спробуйте вибрати інший час.',
    'minimal allowed date for vpoIssueDate is 2022-01-01':
      'Бронювання можливе тільки для власників довідок ВПО від 2022 року.',
    'You have already registered in current registration period':
      'Ви вже реєструвалися у поточний період реєстрації. Ви можете знайти інформацію про ваше бронювання на головній сторінці за номером довідки ВПО.',
  } as Record<string, string>,
  timeSlotErrors: Object.values(TIME_SLOT_ERRORS),
  address: 'Адресa центру:',
  noSlots: (settings: Partial<Serialized<SettingsDto>> = {}) =>
    `На даний момент немає вільних місць у черзі.
    <br/> Наступна реєстрація доступна з ${nextDayLoader(
      settings.endOfRegistrationDate,
    )}.`,
  infoTitle:
    'Умови реєстрації на отримання допомоги у Центрі підтримки ВПО "Життєлюб піклується"',
  confirmInfo: `Я прочитав/-ла, погоджуюсь і даю згоду на обробку моїх персональних даних. Дані будуть зберігатися та оброблятися відповідно до Закону України «Про захист персональних даних» (№2297-17)`,
  infoConfirmationRequired: 'Підтвердіть, що прочитали та згодні',
  info: (
    settings: Partial<Serialized<SettingsDto>> = {},
  ) => `Зареєструватися на отримання допомоги в Центрі можуть громадяни та їхні родичі, які отримали статус ВПО після 24.02.2022 у Києві, та мешкають і знаходяться у цьому місті.

Для отримання допомоги в Центрі, необхідно мати з собою оригінали ваших документів, а також документів членів вашої родини, яких ви зареєстрували в черзі:<ul style="margin: 0;line-height: 0.3rem;">
    <li style="line-height: 1.3rem;">довідок ВПО з реєстрацією після 24.02.2022;</li>
    <li style="line-height: 1.3rem;">довідок ІПН (РНОКПП);</li>
    <li style="line-height: 1.3rem;">паспортів.</li>
  </ul>
Отримати допомогу в Центрі можна лише після реєстрації та в заброньований вами час.

У разі неявки в Центрі у заброньований вами час ви зможете зареєструватися ще раз не раніше ${nextDayLoader(
    settings.endOfRegistrationDate,
  )}.
Слідкуйте за оновленнями на сторінці фонду «Життєлюб» у Фейсбуці <a href="https://www.facebook.com/projectgiznelub">www.facebook.com/projectgiznelub</a>`,
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
      taxIdNumber: 'РНОКПП',
      phoneNumber: 'Телефон',
      email: 'Пошта',
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
      minScheduleDate: 'Мін. заброньована дата',
      maxScheduleDate: 'Макс. заброньована дата',
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
      success: 'Дані успішно імпортовані',
      error: 'Виникла помилка для деяких записів при импорті файлу',
    },
  },
  schedule: {
    title: 'Розклад',
  },
  settings: {
    title: 'Налаштування',
    form: {
      daysToNextVpoRegistration: 'Кількість днів до повторної реєстрації ВПО',
      startOfRegistrationDate: 'Дата початку реєстрації',
      startOfRegistrationDateHelper:
        'Не забудьте змінити кінцеву дату реєстрації',
      startOfRegistrationDateBeforeEndError:
        'Початкова дата реєстрації повинна бути до кінцевої',
      endOfRegistrationDate: 'Дата кінця реєстрації',
      endOfRegistrationDateHelper:
        'Не забудьте змінити початкову дату реєстрації',
      scheduleDaysAvailable:
        'Кількість днів, яка доступна на вибір для ВПО при реєстрації',
      addresses: BOOKING.address,
    },
  },
  saveButton: 'Зберегти',
  infoDialog: {
    successTitle: 'Готово',
    errorTitle: 'Помилка',
    errorContent:
      'Виникла помилка при збереженні данних. Перезавантажте сторінку та спробуйте знову. Якщо помилка повториться, зверніться за допомогою до адміністратора веб-ресурсу.',
    closeButton: 'Закрити',
  },
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
