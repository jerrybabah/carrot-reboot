import '@vant/touch-emulator';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';

Locale.use('en-US', enUS);

const messages = {
  'en-US': {
    vanCalendar: {
      title: '달력',
      end: '종료일',
      start: '시작일',
      startEnd: '시작/종료일',
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      monthTitle: (year: number, month: number) => `${year}년 ${month}월`,
      rangePrompt: (maxRange: number) => `${maxRange}일 이상의 작업일은 선택할 수 없습니다.`,
    },
  },
};

Locale.add(messages);
