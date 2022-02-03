import dayjs from 'dayjs';
import { Clock } from '../../../src/core/utils/clock';

export const currentDate: dayjs.Dayjs = dayjs.utc('2022-01-31 22:00');

export const clockMock: Clock = { now: () => currentDate };
