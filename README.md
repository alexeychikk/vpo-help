# VPO Help

This project was generated using [Nx](https://nx.dev).\
Server is a monolith built using [NestJS](https://docs.nestjs.com/) framework.\
Client is a [React](https://reactjs.org/) application.

## API

This project has monolithic architecture and provides the following REST-full API:

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

---

### PUT /schedule

_Auth, Permissions:_ **["SCHEDULE.WRITE"]**

```ts
// PAYLOAD
ScheduleDto {
  1: [
    {
      timeFrom: TimeString,
      timeTo: TimeString,
      numberOfPersons: Number,
    }
  ],
  ...,
  7: [{...}],
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
VpoModel {
  vpoIssueDate: DateISOString,
  vpoReferenceNumber: String,
  firstName: String,
  lastName: String,
  middleName: String,
  dateOfBirth: DateISOString,
  addressOfRegistration: String,
  addressOfResidence: String,
  numberOfRelatives: Number,
  numberOfRelativesBelow16: Number,
  numberOfRelativesAbove65: Number,
  scheduleDate: DateISOString,
  receivedHelpDate?: DateISOString,
  receivedGoods?: { [productName]: Number },
  phoneNumber?: String,
  email?: String,
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
  content: {
    [fieldName]: String,
  }
}
// RESPONSE
{ ...HtmlPageModel }
```
