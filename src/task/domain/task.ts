import dayjs from 'dayjs';
import { Clock, clockFactory } from '../../core/utils/clock';

export type Color = string;

export enum TaskStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED'
}

export interface Task {
  id: number;
  name: string;
  color: Color;
  description: string;
  status: TaskStatus;
  create: dayjs.Dayjs;
  update?: dayjs.Dayjs;
}

export const taskFactory = {
  createTask(input: Pick<Task, 'name' | 'color' | 'description'>): Task {
    return { ...input, id: 0, create: dayjs.utc(), status: TaskStatus.ACTIVE };
  }
};

export function taskModel(task: Task) {
  return {
    set: ({ name, color, description }: Partial<Pick<Task, 'name' | 'color' | 'description'>>, clock: Clock = clockFactory()): Task => {
      return {
        ...task,
        name: name || task.name,
        color: color || task.color,
        description: description || task.description,
        update: clock.now()
      };
    }
  };
}
