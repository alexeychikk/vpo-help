export const environment = {
  production: process.env.CLIENT_ENV === 'production',
  url: process.env.API_URL,
  emailVerificationEnabled: process.env.EMAIL_VERIFICATION_ENABLED === 'true',
  showRelativesFields: process.env.SHOW_RELATIVES_FIELDS === 'true',
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      CLIENT_ENV: string;
      EMAIL_VERIFICATION_ENABLED: string;
      SHOW_RELATIVES_FIELDS: string;
    }
  }
}
