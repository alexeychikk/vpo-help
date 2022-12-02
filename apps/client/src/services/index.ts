import { environment } from '../environments/environment';
import { Auth } from './auth';
import { Html } from './html';
import { Schedule } from './schedule';
import { Settings } from './settings';
import { Vpo } from './vpo';

export * from './auth';
export * from './html';
export * from './schedule';
export * from './settings';
export * from './vpo';

export const authService = new Auth(environment.url);
export const htmlService = new Html(environment.url);
export const scheduleService = new Schedule(environment.url);
export const settingsService = new Settings(environment.url);
export const vpoService = new Vpo(environment.url);
