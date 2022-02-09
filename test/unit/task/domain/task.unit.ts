import dayjs from 'dayjs';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import { taskModel, TaskStatus } from '../../../../src/task/domain/task';
import { Clock } from '../../../../src/core/utils/clock';
import { expect } from 'chai';

describe('Task unit tests', () => {
  const currentDate = dayjs.utc('2022-01-31 22:00');
  const clock: Clock = { now: () => currentDate };

  it('GIVEN new value on fields WHEN set THEN return changed task with new updated', async () => {
    // GIVEN
    const task = taskBuilder().withName('task name').withColor('#111111').withDescription('task description').valueOf();

    // WHEN
    const result = taskModel(task).set({ name: 'updated name', description: 'updated description', color: '#222222' }, clock);

    // THEN
    expect(result).to.deep.equal({ ...task, name: 'updated name', description: 'updated description', color: '#222222', update: currentDate });
  });

  it('GIVEN task WHEN remove THEN return task with REMOVED status', async () => {
    // GIVEN
    const task = taskBuilder().withStatus(TaskStatus.ACTIVE).valueOf();

    // WHEN
    const result = taskModel(task).remove(clock);

    // THEN
    expect(result).to.deep.equal({ ...task, status: TaskStatus.REMOVED, update: currentDate });
  });
});
