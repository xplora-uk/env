import { IEnvService, IEnvServiceOptions, IObjectWithStrings, IProcessEnv, JsonType } from './types';
import { csvParseRow, filterEnv, filterEnvAndRemoveKeyPrefix, json5Parse, jsonParse } from './utils';

const TRUTHY = ['true', '1', 'yes', 'on'];

export class EnvService<TPenv extends IProcessEnv = IProcessEnv, TKey = keyof TPenv> implements IEnvService<TPenv, TKey> {

  constructor(
    public penv: TPenv,
    public options: IEnvServiceOptions,
  ) {
    this.options = {
      keyPrefix: '',
      ignoreEmptyStrings: true,
      ...options,
    };
    this.penv = this.filterEnv(penv, this.options.keyPrefix) as TPenv; // pretending
  }

  filterEnv(penv: IProcessEnv, keyPrefix = ''): IProcessEnv {
    return filterEnv(penv, keyPrefix, false);
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
    try {
      return val ? new URL(val) : null;
    } catch (err) {
      return null;
    }
  }

  json(key: TKey, defaultValue: JsonType): JsonType {
    const val = this.str(key, '');
    return jsonParse(val, defaultValue);
  }

  json5(key: TKey, defaultValue: JsonType): JsonType {
    const val = this.str(key, '');
    return json5Parse(val, defaultValue);
  }

  csv(key: TKey, defaultValue: string): string[] {
    const val = this.str(key, defaultValue);
    return csvParseRow(val, []);
  }

  newEnv(keyPrefix: string): IEnvService<TPenv> {
    return new EnvService<TPenv>(this.penv, {
      keyPrefix: `${this.options.keyPrefix}${keyPrefix}`,
      ignoreEmptyStrings: this.options.ignoreEmptyStrings,
    });
  }

  loopForEnv<T = any>(
    counterKey: TKey,
    indexKeyPrefix: string,
    envHandler: (env: IEnvService, index: number, keyPrefix: string) => T,
    indexKeyGlue = '_',
  ): Array<T> {
    const list: Array<T> = [];

    const count = this.int(counterKey, 0);
    for (let i = 1; i <= count; i++) {
      const keyPrefix = `${indexKeyPrefix}${i}${indexKeyGlue}`;
      const env = this.newEnv(keyPrefix);
      const settings = envHandler(env, i, keyPrefix) as T;
      list.push(settings); // pretending but it's ok
    }

    return list;
  }

  loopGetEnvSettings(counterKey: TKey, indexKeyPrefix: string, indexKeyGlue = '_'): Array<IObjectWithStrings> {
    return this.loopForEnv<IObjectWithStrings>(
      counterKey,
      indexKeyPrefix,
      (env, _idx, keyPrefix) => filterEnvAndRemoveKeyPrefix(env.penv, keyPrefix) as IObjectWithStrings,
      indexKeyGlue,
    );
  }
}
