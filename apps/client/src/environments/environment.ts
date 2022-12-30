export const environment = {
  production: process.env.CLIENT_ENV === 'production',
  url: process.env.API_URL,
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      CLIENT_ENV: string;
    }
  }
}
