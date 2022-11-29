import { Auth } from './auth';
import { Html } from './html';
import { Schedule } from './schedule';
import { Settings } from './settings';
import { Vpo } from './vpo';

const url = 'http://localhost:3332';

export const authService = new Auth(url);
export const htmlService = new Html(url);
export const scheduleService = new Schedule(url);
export const settingsService = new Settings(url);
export const vpoService = new Vpo(url);
