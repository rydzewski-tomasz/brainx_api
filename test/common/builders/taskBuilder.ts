import { Task, TaskStatus } from '../../../src/task/domain/task';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function sampleTask(): Task {
  return {
    id: 123,
    name: 'Sample task',
    color: '#112233',
    status: TaskStatus.ACTIVE,
    description: 'Sample task description',
    create: dayjs.utc('2022-01-01 22:33'),
    update: dayjs.utc('2022-01-02 20:33')
  };
}

export const taskBuilder = (object: Task = sampleTask()) => {
  return {
    withId: (id: Task['id']) => taskBuilder({ ...object, id }),
    withName: (name: Task['name']) => taskBuilder({ ...object, name }),
    withColor: (color: Task['color']) => taskBuilder({ ...object, color }),
    withStatus: (status: Task['status']) => taskBuilder({ ...object, status }),
    withDescription: (description: Task['description']) => taskBuilder({ ...object, description }),
    withCreate: (create: Task['create']) => taskBuilder({ ...object, create }),
    withUpdate: (update: Task['update']) => taskBuilder({ ...object, update }),
    valueOf: () => object
  };
};
