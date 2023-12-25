import { parse as csvParseRaw } from 'csv-parse/sync';
import JSON5 from 'json5';
import { IProcessEnv, JsonType } from './types';
import { on } from 'events';

export function filterEnv(penv: IProcessEnv, keyPrefix: string, removePrefix: boolean): IProcessEnv {
  if (keyPrefix === '') return penv;

  const env: IProcessEnv = {};

  Object.entries(penv).forEach(([key, val]) => {
    if (key.startsWith(keyPrefix)) {
      if (removePrefix) {
        const suffix = key.replace(keyPrefix, '');
        env[suffix] = val;
      } else {
        env[key] = val;
      }
    }
  });

  return env;
}

export function filterEnvAndRemoveKeyPrefix(penv: IProcessEnv, keyPrefix: string): IProcessEnv {
  return filterEnv(penv, keyPrefix, true);
}

export function jsonParse<T extends JsonType>(str: string, onErrorReturn: T | null): T | null {
  try {
    return JSON.parse(str) as T; // pretending
  } catch (err) {
    return onErrorReturn;
  }
}

export function json5Parse<T extends JsonType>(str: string, onErrorReturn: T | null): T | null {
  try {
    return JSON5.parse(str) as T; // pretending
  } catch (err) {
    return onErrorReturn;
  }
}

export function csvParseRow(str: string, onErrorReturn: string[]): string[] {
  try {
    const rows = csvParseRaw(str, { columns: false });
    if (rows && Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    } else {
      return onErrorReturn;
    }
  } catch (err) {
    return onErrorReturn;
  }
}
