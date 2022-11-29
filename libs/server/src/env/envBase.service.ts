import fs from 'fs';
import path from 'path';
import { getClassGetters } from '@vpo-help/utils';

export enum NodeEnv {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export abstract class EnvBaseService {
  readonly instanceCreatedAt = new Date();
  protected packageJson: { name: string; version: string };

  constructor() {
    const packageString = this.IS_TEST
      ? JSON.stringify({ name: 'test', version: '0.0.0' })
      : fs.readFileSync(path.resolve(__dirname, './package.json'), {
          encoding: 'utf8',
        });
    this.packageJson = JSON.parse(packageString);
  }

  get JWT_SECRET(): string {
    return this.getVar('JWT_SECRET');
  }

  get CORS_ORIGIN(): string {
    return this.getVar('CORS_ORIGIN', '*');
  }

  get DB_URL(): string {
    return this.getVar('DB_URL', 'mongodb://mongodb:27017/vpo-help');
  }

  get TZ(): string {
    return this.getVar('TZ');
  }

  get HOST(): string {
    return this.getVar('HOST', '0.0.0.0');
  }

  get IS_DEV(): boolean {
    return this.NODE_ENV === NodeEnv.Development;
  }

  get IS_TEST(): boolean {
    return this.NODE_ENV === NodeEnv.Test;
  }

  get IS_PROD(): boolean {
    return this.NODE_ENV === NodeEnv.Production;
  }

  get NAME(): string {
    return this.packageJson.name;
  }

  get NODE_ENV(): NodeEnv {
    return this.getVar('NODE_ENV', NodeEnv.Production).toLowerCase() as NodeEnv;
  }

  get PORT(): number {
    return parseInt(this.getVar('PORT'));
  }

  get VERSION(): string {
    return this.packageJson.version;
  }

  setVariable(variable: string, value: string) {
    process.env[variable] = value;
    return this;
  }

  ensureVariablesSet() {
    getClassGetters(Object.getPrototypeOf(this).constructor).forEach((getter) =>
      getter.value.call(this),
    );
  }

  protected getVar(name: string, defaultValue?: string) {
    const val = process.env[name];
    if (val !== undefined) {
      return val;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is missing`);
  }

  protected getJsonVar<Value>(name: string, defaultValue?: Value): Value {
    const stringValue = this.getVar(
      name,
      defaultValue === undefined ? undefined : '',
    );
    if (stringValue !== '') {
      try {
        return JSON.parse(stringValue) as Value;
      } catch (err) {
        throw new Error(`Environment variable ${name} is not in JSON format`);
      }
    }
    return defaultValue as Value;
  }
}
