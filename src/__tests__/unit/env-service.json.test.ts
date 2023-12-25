import { expect } from 'chai';
import { EnvService } from '../../env-service';
import { IProcessEnv } from '../../types';

describe('env-service with JSON and JSON5', () => {

  interface EnvTypeJson extends IProcessEnv {
    KEY_JSON_VALID  ?: string;
    KEY_JSON_INVALID?: string;
    KEY_JSON_NIL    ?: string;

    KEY_JSON5_VALID  ?: string;
    KEY_JSON5_INVALID?: string;
    KEY_JSON5_NIL    ?: string;
  }

  const penv: EnvTypeJson = {
    KEY_JSON_VALID  : '{"key1":"val1","key2":2,"key3":true,"key4":null}',
    KEY_JSON_INVALID: '{"key1":"val1","key2":2,"key3":true,"key4":null',
    KEY_JSON_NIL    : '',

    KEY_JSON5_VALID  : '{key15:"val1",key25:2,key35:true,key45:null}',
    KEY_JSON5_INVALID: '{key15:"val1",key25:2,key35:true,key45:null',
    KEY_JSON5_NIL    : '',
  };

  const env = new EnvService<EnvTypeJson>(penv, { ignoreEmptyStrings: true });

  it('should return object of existing valid JSON key correctly', () => {
    const result = env.json('KEY_JSON_VALID', {});
    expect(result).deep.equal({
      key1: 'val1',
      key2: 2,
      key3: true,
      key4: null,
    });
  });

  it('should return null of existing invalid JSON key', () => {
    const result = env.json('KEY_JSON_INVALID', null);
    expect(result).deep.equal(null);
  });

  it('should return null of existing empty JSON key', () => {
    const result = env.json('KEY_JSON_NIL', null);
    expect(result).deep.equal(null);
  });

  // json5
  it('should return object of existing valid JSON5 key correctly', () => {
    const result = env.json5('KEY_JSON5_VALID', {});
    expect(result).deep.equal({
      key15: 'val1',
      key25: 2,
      key35: true,
      key45: null,
    });
  });

  it('should return null of existing invalid JSON5 key', () => {
    const result = env.json5('KEY_JSON5_INVALID', null);
    expect(result).deep.equal(null);
  });

  it('should return null of existing empty JSON5 key', () => {
    const result = env.json5('KEY_JSON5_NIL', null);
    expect(result).deep.equal(null);
  });

});
