import { Task } from '../../../src/task/domain/task';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function sampleTask(): Task {
  return {
    id: 123,
    name: 'Sample task',
    color: '#112233',
    description: 'Sample task description',
    create: dayjs.utc('2022-11-01 22:33'),
    update: dayjs.utc('2022-12-01 20:33')
  };
}

export const taskBuilder = (object: Task = sampleTask()) => {
  return {
    withId: (id: Task['id']) => taskBuilder({ ...object, id }),
    withName: (name: Task['name']) => taskBuilder({ ...object, name }),
    withColor: (color: Task['color']) => taskBuilder({ ...object, color }),
    withDescription: (description: Task['description']) => taskBuilder({ ...object, description }),
    withCreate: (create: Task['create']) => taskBuilder({ ...object, create }),
    withUpdated: (update: Task['update']) => taskBuilder({ ...object, update }),
    valueOf: () => object
  };
};
