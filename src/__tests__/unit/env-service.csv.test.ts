import { expect } from 'chai';
import { EnvService } from '../../env-service';
import { IProcessEnv } from '../../types';

describe('env-service with CSV', () => {

  interface EnvTypeCsv extends IProcessEnv {
    KEY_CSV_VALID  ?: string;
    KEY_CSV_INVALID?: string;
    KEY_CSV_NIL    ?: string;
  }

  const penv: EnvTypeCsv = {
    KEY_CSV_VALID  : 'val1,2,true,',
    KEY_CSV_INVALID: '"val1,2,true,null',
    KEY_CSV_NIL    : '',
  };

  const env = new EnvService<EnvTypeCsv>(penv, { ignoreEmptyStrings: true });

  it('should return array of strings for existing valid CSV key correctly', () => {
    const result = env.csv('KEY_CSV_VALID', '');
    expect(result).deep.equal(['val1', '2', 'true', '']);
  });

  it('should return emmpty array existing invalid CSV key', () => {
    const result = env.csv('KEY_CSV_INVALID', '');
    expect(result).deep.equal([]);
  });

  it('should return emmpty array existing empty CSV key', () => {
    const result = env.csv('KEY_CSV_NIL', '');
    expect(result).deep.equal([]);
  });

});
