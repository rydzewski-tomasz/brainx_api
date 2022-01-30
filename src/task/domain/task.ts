import dayjs from 'dayjs';

export type Color = string;

export interface Task {
  id: number;
  name: string;
  color: Color;
  description: string;
  create: dayjs.Dayjs;
  update?: dayjs.Dayjs;
}

export const taskFactory = {
  createTask(input: Pick<Task, 'name' | 'color' | 'description'>): Task {
    return { ...input, id: 0, create: dayjs.utc() };
  }
};
