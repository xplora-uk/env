# env

Library to make it easier to work with process.env

## requirements

* Node v18.19.0+

## usage

```sh
npm i @xplora-uk/env
```

```javascript
const { EnvService, IProcessEnv } = require('@xplora-uk/env');

interface MyEnvSettings extends IProcessEnv {
  HTTP_PORT  ?: string;
  MAIN_DB_URL?: string;
  API_KEY    ?: string;
}

const env = new EnvService<MyEnvSettings>(process.env, { ignoreEmptyStrings: true });
//const env = new EnvService(process.env, { ignoreEmptyStrings: true, keyPrefix: 'MY_APP_' });

const httpPort = env.int('HTTP_PORT', 8080);

const envDb = env.newEnv('MAIN_DB_');
const dbUrl = envDb.url('URL', 'mysql://localhost/test_db'); // URL or null
if (dbUrl.hostname === 'localhost') {
  // do something
}

const envProxy = env.proxy;
if (envProxy.HTTP_PORT) { // editor should recognise properties as you use proxy object
  // always returned as string like env.str('HTTP_PORT')
}
```

## interface

```typescript
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

export type IProcessEnv = typeof process.env; // Record<string, string | undefined>

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
```

## maintenance

### installation

```sh
npm i
```

### code

```plain
src/
  __tests__/
    unit/
      TODO
  env-service.ts  implementation
  index.ts        main file that exports features of this library
  types.ts        TypeScript types
```

### build

```sh
npm run build
```

### tests

You can run tests with/without coverage info.

```sh
npm run test:unit
npm run test:unit:coverage
```

Current coverage:

```plain
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------|---------|----------|---------|---------|-------------------
All files       |     100 |      100 |     100 |     100 |                   
 env-service.ts |     100 |      100 |     100 |     100 |                   
----------------|---------|----------|---------|---------|-------------------
```

### publish

It is important to increment version number using semantic versioning in `package.json` and re-create `package-lock.json`

```sh
# https://docs.npmjs.com/cli/v9/commands/npm-login
# using a member in xplora-uk
npm login

# https://docs.npmjs.com/cli/v9/commands/npm-publish
npm publish --access public
```
