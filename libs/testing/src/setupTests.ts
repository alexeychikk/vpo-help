import { faker } from '@faker-js/faker';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DB_URL: 'mongodb://localhost:27017/vpo-help',
  API_SERVICE_URL: 'http://localhost:3332',
  JWT_SECRET: 'YOUR_CUSTOM_VERY_STRONG_SECRET',
});

faker.seed(1);

export {};
