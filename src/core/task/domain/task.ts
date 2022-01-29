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
