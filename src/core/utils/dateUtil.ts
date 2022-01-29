import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

function fromText(input: string, format = defaultFormat): dayjs.Dayjs {
  return dayjs.utc(input, format);
}

function fromDbDate(input: Date): dayjs.Dayjs {
  const asText = parseNativeDateToText(input);
  return fromText(asText);
}

function parseNativeDateToText(input: Date): string {
  return dayjs(input).format(defaultFormat);
}

function toText(input: dayjs.Dayjs): string {
  return input.format(defaultFormat);
}

function now(): dayjs.Dayjs {
  return dayjs.utc().millisecond(0);
}

export default {
  fromText,
  toText,
  fromDbDate,
  now
};
