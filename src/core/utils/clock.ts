import dayjs, { Dayjs } from 'dayjs';

export interface Clock {
  now: () => Dayjs;
}

function now(): Dayjs {
  return dayjs();
}

export function clockFactory(): Clock {
  return {
    now
  };
}
