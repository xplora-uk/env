import { IProcessEnv } from './types';

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
