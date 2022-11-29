Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_SECRET: 'YOUR_CUSTOM_VERY_STRONG_SECRET',
  TZ: 'Europe/Kyiv',
});

export {};
