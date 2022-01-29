import { Task } from '../../../src/core/task/domain/task';
import dayjs from 'dayjs';

export function sampleTask(): Task {
  return {
    id: 123,
    name: 'Sample task',
    color: '#112233',
    description: 'Sample task description',
    create: dayjs.utc('2022-11-01 22:33'),
    update: undefined
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
