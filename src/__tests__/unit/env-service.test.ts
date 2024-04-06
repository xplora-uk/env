import { expect } from 'chai';
import { EnvService } from '../../env-service';
import { IProcessEnv } from '../../types';

describe('env-service', () => {

  interface EnvType1 extends IProcessEnv {
    KEY_STR_1    ?: string;
    KEY_STR_NIL_1?: string;
    KEY_STR_NIL_2?: string;

    KEY_INT_1    ?: string;
    KEY_INT_NIL_1?: string;
    KEY_INT_NIL_2?: string;

    KEY_FLOAT_1    ?: string;
    KEY_FLOAT_NIL_1?: string;
    KEY_FLOAT_NIL_2?: string;

    KEY_BOOL_TRUE_1     ?: string;
    KEY_BOOL_TRUE_2     ?: string;
    KEY_BOOL_TRUE_3     ?: string;
    KEY_BOOL_TRUE_4     ?: string;
    KEY_BOOL_FALSE_1    ?: string;
    KEY_BOOL_FALSE_NIL_1?: string;
    KEY_BOOL_FALSE_NIL_2?: string;

    KEY_URL_HTTPS  ?: string;
    KEY_URL_INVALID?: string;
    KEY_URL_NIL_1  ?: string;
    KEY_URL_NIL_2  ?: string;
  }

  type EnvType2 = Omit<EnvType1, 'KEY_STR_NIL_2' | 'KEY_INT_NIL_2' | 'KEY_FLOAT_NIL_2' | 'KEY_BOOL_FALSE_NIL_2' | 'KEY_URL_NIL_2'>;

  const penv: EnvType1 = {
    KEY_STR_1           : 'abc',
    KEY_STR_NIL_1       : '',
    KEY_STR_NIL_2       : undefined,
    KEY_INT_1           : '1',
    KEY_INT_NIL_1       : '',
    KEY_INT_NIL_2       : undefined,
    KEY_FLOAT_1         : '3.14',
    KEY_FLOAT_NIL_1     : '',
    KEY_FLOAT_NIL_2     : undefined,
    KEY_BOOL_TRUE_1     : 'true',
    KEY_BOOL_TRUE_2     : 'on',
    KEY_BOOL_TRUE_3     : 'yes',
    KEY_BOOL_TRUE_4     : '1',
    KEY_BOOL_FALSE_1    : 'false',
    KEY_BOOL_FALSE_NIL_1: '',
    KEY_BOOL_FALSE_NIL_2: undefined,
    KEY_URL_HTTPS       : 'https://example.com:8080/path1',
    KEY_URL_INVALID     : 'http',
    KEY_URL_NIL_1       : '',
    KEY_URL_NIL_2       : undefined,
  };

  const penv2: EnvType2 = {
    KEY_STR_1           : 'abc',
    KEY_STR_NIL_1       : '',
    //KEY_STR_NIL_2       : undefined,
    KEY_INT_1           : '1',
    KEY_INT_NIL_1       : '',
    //KEY_INT_NIL_2       : undefined,
    KEY_FLOAT_1         : '3.14',
    KEY_FLOAT_NIL_1     : '',
    //KEY_FLOAT_NIL_2     : undefined,
    KEY_BOOL_TRUE_1     : 'true',
    KEY_BOOL_TRUE_2     : 'on',
    KEY_BOOL_TRUE_3     : 'yes',
    KEY_BOOL_TRUE_4     : '1',
    KEY_BOOL_FALSE_1    : 'false',
    KEY_BOOL_FALSE_NIL_1: '',
    //KEY_BOOL_FALSE_NIL_2: undefined,
    KEY_URL_HTTPS       : 'https://example.com:8080/path1',
    KEY_URL_NIL_1       : '',
    //KEY_URL_NIL_2       : undefined,
  };

  describe('ignoreEmptyStrings true', () => {
    const env = new EnvService<EnvType1>(penv, { ignoreEmptyStrings: true });

    it('should return string of existing key correctly', () => {
      expect(env.str('KEY_STR_1', '')).equal(penv.KEY_STR_1);
    });

    it('should return string of nonexisting key using default', () => {
      expect(env.str('KEY_STR_NIL_1', 'def')).equal('def');
      expect(env.str('KEY_STR_NIL_2', 'ghi')).equal('ghi');
    });

    it('should return integer of existing key correctly', () => {
      expect(env.int('KEY_INT_1', 0)).equal(1);
    });

    it('should return integer of empty key using default', () => {
      expect(env.int('KEY_INT_NIL_1', 1)).equal(1);
      expect(env.int('KEY_INT_NIL_1', 2)).equal(2);
      expect(env.int('KEY_INT_NIL_2', 3)).equal(3);
      expect(env.int('KEY_INT_NIL_2', 4)).equal(4);
    });

    it('should return float of existing key correctly', () => {
      expect(env.float('KEY_FLOAT_1', 0)).equal(3.14);
    });

    it('should return float of empty key using default', () => {
      expect(env.float('KEY_FLOAT_NIL_1', 1.23)).equal(1.23);
      expect(env.float('KEY_FLOAT_NIL_2', 2.34)).equal(2.34);
    });

    it('should return boolean of existing key correctly', () => {
      expect(env.bool('KEY_BOOL_TRUE_1', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_2', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_3', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_4', false)).equal(true);
      expect(env.bool('KEY_BOOL_FALSE_1', true)).equal(false);
    });

    it('should return boolean of empty key using default', () => {
      expect(env.bool('KEY_BOOL_FALSE_NIL_1', true)).equal(true);
      expect(env.bool('KEY_BOOL_FALSE_NIL_2', false)).equal(false);
    });

    it('should return URL of existing key correctly', () => {
      const url = env.url('KEY_URL_HTTPS', 'http://example.com');
      expect(url instanceof URL).equal(true);
      if (url) {
        expect(url.protocol).equal('https:');
        expect(url.host).equal('example.com:8080');
        expect(url.hostname).equal('example.com');
        expect(url.port).equal('8080');
        expect(url.pathname).equal('/path1');
      }
    });

    it('should return null for invalid URL key', () => {
      const url = env.url('KEY_URL_INVALID', '');
      expect(url).equal(null);
    });

    it('should return URL of empty key using default', () => {
      const url = env.url('KEY_URL_NIL_1', 'http://example.com');
      expect(url instanceof URL).equal(true);
      if (url) {
        expect(url.host).equal('example.com');
      }
      const url2 = env.url('KEY_URL_NIL_2', 'http://example.com');
      expect(url2 instanceof URL).equal(true);
      if (url2) {
        expect(url2.host).equal('example.com');
      }
    });
  });

  describe('ignoreEmptyStrings false', () => {
    const env = new EnvService<EnvType2>(penv2, { ignoreEmptyStrings: false });

    it('should return string of existing key correctly', () => {
      expect(env.str('KEY_STR_1', '')).equal(penv2.KEY_STR_1);
    });

    it('should return string of nonexisting key using default', () => {
      expect(env.str('KEY_STR_NIL_1', 'def')).equal('');
      expect(env.str('KEY_STR_NIL_2', 'ghi')).equal('ghi');
    });

    it('should return integer of existing key correctly', () => {
      expect(env.int('KEY_INT_1', 0)).equal(1);
    });

    it('should return integer of empty key using default', () => {
      expect(env.int('KEY_INT_NIL_1', 1)).equal(1);
      expect(env.int('KEY_INT_NIL_1', 2)).equal(2);
      expect(env.int('KEY_INT_NIL_2', 3)).equal(3);
      expect(env.int('KEY_INT_NIL_2', 4)).equal(4);
    });

    it('should return float of existing key correctly', () => {
      expect(env.float('KEY_FLOAT_1', 0)).equal(3.14);
    });

    it('should return float of empty key using default', () => {
      expect(env.float('KEY_FLOAT_NIL_1', 1.23)).equal(1.23);
      expect(env.float('KEY_FLOAT_NIL_2', 2.34)).equal(2.34);
    });

    it('should return boolean of existing key correctly', () => {
      expect(env.bool('KEY_BOOL_TRUE_1', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_2', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_3', false)).equal(true);
      expect(env.bool('KEY_BOOL_TRUE_4', false)).equal(true);
      expect(env.bool('KEY_BOOL_FALSE_1', true)).equal(false);
    });

    it('should return boolean of empty key using default', () => {
      expect(env.bool('KEY_BOOL_FALSE_NIL_1', true)).equal(false);
      expect(env.bool('KEY_BOOL_FALSE_NIL_2', false)).equal(false);
    });

    it('should return URL of existing key correctly', () => {
      const url = env.url('KEY_URL_HTTPS', 'http://example.com');
      expect(url instanceof URL).equal(true);
      if (url) {
        expect(url.protocol).equal('https:');
        expect(url.host).equal('example.com:8080');
        expect(url.hostname).equal('example.com');
        expect(url.port).equal('8080');
        expect(url.pathname).equal('/path1');
      }
    });

    it('should return URL of empty key using default', () => {
      const url = env.url('KEY_URL_NIL_1', 'http://example.com');
      expect(url instanceof URL).equal(false);
      const url2 = env.url('KEY_URL_NIL_2', 'http://example.com');
      expect(url2 instanceof URL).equal(true);
      if (url2) {
        expect(url2.host).equal('example.com');
      }
    });
  });

  describe('keyPrefix KEY_', () => {
    const env = new EnvService<EnvType1>(penv, { ignoreEmptyStrings: true, keyPrefix: 'KEY_' });
    
    it('should use a smaller env settings object', () => {
      expect(Object.keys(env.penv).length).equal(20);
    });

    it('should return string of existing key correctly', () => {
      expect(env.str('STR_1', '')).equal(penv.KEY_STR_1);
    });

    it('should return new env service with additional prefix BOOL_', () => {
      const env2 = env.newEnv('BOOL_');
      expect(env2.str('TRUE_1', '')).equal(penv.KEY_BOOL_TRUE_1);
      expect(Object.keys(env2.penv).length).equal(7);
    });
  });

  describe('proxy utility property', () => {
    const env = new EnvService<EnvType1>(penv, { ignoreEmptyStrings: true });

    it('should return string of existing key correctly', () => {
      expect(env.str('KEY_STR_1')).equal(penv.KEY_STR_1);
    });

    it('should return string of existing key correctly', () => {
      expect(env.proxy.KEY_STR_1).equal(penv.KEY_STR_1);
    });

    it('should return empty string of nonexisting key', () => {
      expect(env.proxy.SOMETHING).equal('');
    });

  });

  describe('filterEnv utility function', () => {
    const env = new EnvService<EnvType1>(penv, { ignoreEmptyStrings: true });
    it('should return a new env object with filtered keys', () => {
      const settings = env.filterEnv(penv); // check without keyPrefix
      expect(Object.keys(settings).length).equal(Object.keys(penv).length);
    })
  });

});
