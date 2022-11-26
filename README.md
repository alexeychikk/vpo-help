# VPO Help

This project was generated using [Nx](https://nx.dev).\
Server is a monolith built using [NestJS](https://docs.nestjs.com/) framework.\
Client is a [React](https://reactjs.org/) application.

## API

This project has monolithic architecture and provides the following REST-full API:

### POST /auth/login/vpo

```ts
// PAYLOAD
{
  vpoReferenceNumber: String,
}
// RESPONSE
{
  user: {
    id: String,
    role: "VPO",
    vpoReferenceNumber: String,
    scheduleDate: DateISOString,
  },
  permissions: [Permission],
  accessToken: { access_token: String },
}
```

### POST /auth/login/admin

```ts
// PAYLOAD
{
  email: String,
  password: String
}
// RESPONSE
{
  user: {
    id: String,
    role: "ADMIN",
    email: String,
  },
  permissions: [Permission],
  accessToken: { access_token: String }
}
```

---

### PUT /schedule

_Auth, Permissions:_ **["SCHEDULE.WRITE"]**

```ts
// PAYLOAD
{
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
{ ...Schedule }
```

### GET /schedule

```ts
// RESPONSE
{ ...Schedule }
```

### GET /schedule/available

```ts
// RESPONSE
{
  items: [
    {
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
{
  firstName: String,
  lastName: String,
  middleName: String,
  dateOfBirth: DateISOString,
  vpoReferenceNumber: String,
  addressOfRegistration: String,
  addressOfResidence: String,
  numberOfRelatives: Number,
  numberOfRelativesBelow16: Number,
  numberOfRelativesAbove65: Number,
  scheduleDate: DateISOString,
  receivedGoods?: { [productName]: Number },
  phoneNumber?: String,
  email?: String,
}
// RESPONSE
{
  id: String,
  role: "VPO",
  vpoReferenceNumber: String,
}
```

### GET /vpo?PaginationSearchSort

_Auth, Permissions:_ **["VPO_LIST.READ"]**

```ts
// RESPONSE
{
  items: [Vpo],
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
{
  daysToNextVpoRegistration?: Number,
  endOfWarDate?: DateISOString,
  scheduleDaysAvailable?: Number,
}
// RESPONSE
{ ...Settings }
```

### GET /settings

_Auth, Permissions:_ **["SETTINGS.READ"]**

```ts
// RESPONSE
{ ...Settings }
```

---

### GET /html/:page

```ts
// RESPONSE
{
  [fieldName]: String,
}
```

### PUT /html/:page

_Auth, Permissions:_ **["HTML.WRITE"]**

```ts
// PAYLOAD
{
  [fieldName]: String,
}
// RESPONSE
{
  [fieldName]: String,
}
```
