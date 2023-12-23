import { IEnvService, IEnvServiceOptions, IProcessEnv } from './types';

const TRUTHY = ['true', '1', 'yes', 'on'];

export class EnvService<TPenv extends IProcessEnv = IProcessEnv, TKey = keyof TPenv> implements IEnvService<TPenv, TKey> {

  constructor(
    public penv: TPenv,
    public options: IEnvServiceOptions,
  ) {
    this.penv = this.filterEnv(penv, options.keyPrefix) as TPenv; // pretending
    this.options = {
      keyPrefix: '',
      ignoreEmptyStrings: true,
      ...options,
    };
  }

  filterEnv(penv: IProcessEnv, keyPrefix = ''): IProcessEnv {
    if (keyPrefix === '') return penv;
    const env: IProcessEnv = {};
    Object.entries(penv).forEach(([key, val]) => {
      if (key.startsWith(keyPrefix)) env[key] = val;
    });
    return env;
  }

  /**
   * This proxy object is pretending to be an object of type Required<TPenv>.
   * It is expected to help using a pre-defined type for the environment settings directly.
   * Accessing keys will give you a string, even if the key does not exist.
   */
  get proxy(): Required<TPenv> {
    const that = this;
    return new Proxy(this as unknown as Required<TPenv>, {
      get: (_target, prop) => {
        return that.str(prop as TKey, '');
      },
    });
  }

  str(key: TKey, defaultValue: string = ''): string {
    const fullKey = `${this.options.keyPrefix}${key}`;
    if (fullKey in this.penv) {
      if (this.penv[fullKey] !== undefined) {
        if (this.options.ignoreEmptyStrings && String(this.penv[fullKey]).trim() === '') {
          return defaultValue;
        } else {
          return String(this.penv[fullKey]);
        }
      }
    }
    return defaultValue;
  }

  int(key: TKey, defaultValue: number): number {
    const val = this.str(key, String(defaultValue));
    const i = Number.parseInt(val);
    if (Number.isNaN(i)) return defaultValue;
    return i;
  }

  float(key: TKey, defaultValue: number): number {
    const val = this.str(key, String(defaultValue));
    const f = Number.parseFloat(val);
    if (Number.isNaN(f)) return defaultValue;
    return f;
  }

  bool(key: TKey, defaultValue: boolean): boolean {
    const val = this.str(key, defaultValue ? 'true' : 'false');
    return TRUTHY.includes(val.toLowerCase());
  }

  url(key: TKey, defaultValue: string): URL | null {
    const val = this.str(key, defaultValue);
    return val ? new URL(val) : null;
  }

  newEnv(keyPrefix: string): IEnvService {
    return new EnvService(this.penv, {
      keyPrefix: `${this.options.keyPrefix}${keyPrefix}`,
      ignoreEmptyStrings: this.options.ignoreEmptyStrings,
    });
  }
}
