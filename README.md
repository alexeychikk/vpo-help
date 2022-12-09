# VPO Help

This project was generated using [Nx](https://nx.dev).\
Server is a monolith built using [NestJS](https://docs.nestjs.com/) framework.\
Client is a [React](https://reactjs.org/) application.

---

## Deploy

### Using Docker

1. Copy [./apps/api/.env.dev](apps/api/.env.dev) and rename to `.env`.
   Change environment variables to production ones.
2. Run the following command:\
   `docker compose -f compose.prod.yaml up --build`

### Manually

1. Install dependencies\
   1.1 [Git](https://git-scm.com/)\
   1.2 [Node.js 16+](https://nodejs.org/en/)\
   1.3 [MongoDB](https://www.mongodb.com/try/download/community)
2. Install npm dependencies _(in project's folder)_:\
   `npm i`
3. Build _(in project's folder)_:\
   `npm run build`
4. Create `.env` file in project's **root** (see [./apps/api/.env.dev](apps/api/.env.dev)) _OR_ provide environment variables to the run command (see the next step).
5. Run API server _(in project's folder)_:\
   `npm start`

---

## Test

Run automated tests:

```sh
npm run test
```

---

## API

This project has monolithic architecture and provides the following REST-full API _(some endpoints might not be reflected in this doc)_:

### POST /auth/login

```ts
// PAYLOAD
LoginAsUserDto {
  email: String,
  password: String
}
// RESPONSE
LoginAsUserResponse {
  user: UserModel {
    id: String,
    role: "ADMIN",
    email: String,
  },
  permissions: PermissionMap,
  accessToken: { access_token: String }
}
```

### POST /auth/login/vpo

```ts
// PAYLOAD
LoginAsVpoDto {
  vpoReferenceNumber: String,
}
// RESPONSE
LoginAsVpoResponseDto {
  user: VpoUserModel {
    id: String,
    role: "VPO",
    vpoReferenceNumber: String,
    scheduleDate: DateISOString,
  },
  permissions: PermissionMap,
  accessToken: { access_token: String },
}
```

### POST /send-vpo-verification

```ts
// PAYLOAD
EmailHolderDto {
  email: String,
}
// RESPONSE
200
```

---

### PUT /schedule

_Auth, Permissions:_ **["SCHEDULE.WRITE"]**

```ts
// PAYLOAD
ScheduleDto {
  0: [
    {
      timeFrom: TimeString,
      timeTo: TimeString,
      numberOfPersons: Number,
    }
  ],
  ...,
  6: [{...}],
}
// RESPONSE
{ ...ScheduleDto }
```

### GET /schedule

```ts
// RESPONSE
{ ...ScheduleDto }
```

### GET /schedule/available

```ts
// RESPONSE
ScheduleAvailableDto {
  items: [
    ScheduleSlotAvailableDto {
      dateFrom: DateISOString,
      dateTo: DateISOString,
    },
  ];
}
```

---

### POST /vpo

```ts
// PAYLOAD
RegisterVpoDto {
  email: String,
  verificationCode: String,
  vpoIssueDate: DateISOString,
  vpoReferenceNumber: String,
  firstName: String,
  lastName: String,
  middleName: String,
  phoneNumber: String,
  dateOfBirth: DateISOString,
  addressOfRegistration: String,
  addressOfResidence: String,
  numberOfRelatives: Number,
  numberOfRelativesBelow16: Number,
  numberOfRelativesAbove65: Number,
  scheduleDate: DateISOString,
  receivedHelpDate?: DateISOString,
  receivedGoods?: { [productName]: Number },
}
// RESPONSE
{ ...VpoUserModel }
```

### GET /vpo?PaginationSearchSort

_Auth, Permissions:_ **["VPO_LIST.READ"]**

```ts
// RESPONSE
{
  items: [VpoModel],
  totalItems: Number,
}
```

### GET /vpo/export?PaginationSearchSort

_Auth, Permissions:_ **["VPO_EXPORT.READ"]**

```ts
// RESPONSE
vpo_table.csv;
```

### POST /vpo/import

_Auth, Permissions:_ **["VPO_IMPORT.WRITE"]**

```ts
// PAYLOAD
vpo_that_received_goods_table.csv;

// RESPONSE
200;
```

---

### PUT /settings

_Auth, Permissions:_ **["SETTINGS.WRITE"]**

```ts
// PAYLOAD
UpdateSettingsDto {
  daysToNextVpoRegistration?: Number,
  endOfWarDate?: DateISOString,
  scheduleDaysAvailable?: Number,
}
// RESPONSE
{ ...SettingsDto }
```

### GET /settings

_Auth, Permissions:_ **["SETTINGS.READ"]**

```ts
// RESPONSE
{ ...SettingsDto }
```

---

### GET /html/:pageName

```ts
// RESPONSE
HtmlPageModel {
  id: String,
  name: String,
  content: {
    [fieldName]: String,
  }
}
```

### PUT /html/:pageName

_Auth, Permissions:_ **["HTML.WRITE"]**

```ts
// PAYLOAD
{
  name?: String,
  content: {
    [fieldName]: String,
  }
}
// RESPONSE
{ ...HtmlPageModel }
```
