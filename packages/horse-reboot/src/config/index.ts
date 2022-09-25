import { TimeAgoMessages } from '@vueuse/core';

export * from './firebase.config';

export const KOREAN_TIME_AGO_MSGS: TimeAgoMessages = {
  justNow: '방금 전',
  past: (n) => (n.match(/\d/) ? `${n} 전` : n),
  future: (n) => (n.match(/\d/) ? `${n} 후` : n),
  year: (n) => `${n}년`,
  month: (n) => `${n}달`,
  week: (n) => `${n}주`,
  day: (n) => `${n}일`,
  hour: (n) => `${n}시간`,
  minute: (n) => `${n}분`,
  second: (n) => `${n}초`,
};
