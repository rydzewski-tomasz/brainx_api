import dayjs from 'dayjs';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import { taskModel } from '../../../../src/task/domain/task';
import { Clock } from '../../../../src/core/utils/clock';

describe('Task unit tests', () => {
  const currentDate = dayjs.utc('2022-01-31 22:00');
  const clock: Clock = { now: () => currentDate };

  it('GIVEN new value on fields WHEN set THEN return changed task with new updated', async () => {
    // GIVEN
    const task = taskBuilder().withName('task name').withColor('#111111').withDescription('task description').valueOf();

    // WHEN
    const result = taskModel(task).set({ name: 'updated name', description: 'updated description', color: '#222222' }, clock);

    // THEN
    expect(result).toStrictEqual({ ...task, name: 'updated name', description: 'updated description', color: '#222222', update: currentDate });
  });
});
