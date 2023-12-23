export interface IEnvService<TPenv extends IProcessEnv = IProcessEnv, TKey = keyof TPenv> {
  penv: TPenv;
  options: IEnvServiceOptions;

  str  (key: TKey, defaultValue: string): string;
  int  (key: TKey, defaultValue: number): number;
  float(key: TKey, defaultValue: number): number;
  bool (key: TKey, defaultValue: boolean): boolean;
  url  (key: TKey, defaultValue: string): URL | null;

  newEnv(keyPrefix: string): IEnvService;
  filterEnv(penv: IProcessEnv, keyPrefix: string): IProcessEnv;
}

export type IProcessEnv = typeof process.env;

export interface IEnvServiceOptions {
  /**
   * For creating a namespaced environment service.
   * @example 'MYAPP_' to use only keys that start with 'MYAPP_'.
   */
  keyPrefix?: string;

  /**
   * If true, then empty strings are ignored and default value parameter is used.
   */
  ignoreEmptyStrings?: boolean;
}
