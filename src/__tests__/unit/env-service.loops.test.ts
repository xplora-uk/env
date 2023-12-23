import { expect } from 'chai';
import { EnvService } from '../../env-service';
import { IProcessEnv } from '../../types';

describe('env-service with loops', () => {

  interface EnvQueueSettings extends IProcessEnv {
    QUEUES      ?: string;

    QUEUE_1_URL ?: string;
    QUEUE_1_NAME?: string;

    QUEUE_2_URL ?: string;
    QUEUE_2_NAME?: string;
  }

  interface QueueSettingRow {
    index: number;
    url  : string;
    name : string;
  }

  const penv3: EnvQueueSettings = {
    QUEUES      : '2',

    QUEUE_1_URL : 'amqp://localhost:111',
    QUEUE_1_NAME: 'queue1',

    QUEUE_2_URL : 'amqp://localhost:222',
    QUEUE_2_NAME: 'queue2',
  };

  const env = new EnvService<EnvQueueSettings>(penv3, { ignoreEmptyStrings: true });

  it('should loop for env with handler', () => {
    const queues = env.loopForEnv<QueueSettingRow>('QUEUES', 'QUEUE_', (it, index, _keyPrefix) => {
      return {
        index,
        url : it.str('URL', ''),
        name: it.str('NAME', ''),
      };
    });
    expect(queues.length).equal(2);

    expect(queues[0].index).equal(1);
    expect(queues[0].url).equal('amqp://localhost:111');
    expect(queues[0].name).equal('queue1');

    expect(queues[1].index).equal(2);
    expect(queues[1].url).equal('amqp://localhost:222');
    expect(queues[1].name).equal('queue2');
  });

  it('should loop for raw env settings', () => {
    const queues = env.loopGetEnvSettings('QUEUES', 'QUEUE_');

    expect(queues.length).equal(2);

    expect(queues[0].URL).equal('amqp://localhost:111');
    expect(queues[0].NAME).equal('queue1');

    expect(queues[1].URL).equal('amqp://localhost:222');
    expect(queues[1].NAME).equal('queue2');
  });

});
