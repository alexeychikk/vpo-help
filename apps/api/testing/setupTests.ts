Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_SECRET: 'YOUR_CUSTOM_VERY_STRONG_SECRET',
  TZ: 'Europe/Kyiv',
  LANG: 'en_US.UTF-8', // seems like this has no effect in jest
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'admin',
  SMTP_TRANSPORT: JSON.stringify({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'rudy36@ethereal.email',
      pass: 'Zs4F4hZUPDNaSsG4wD',
    },
  }),
});

export {};
