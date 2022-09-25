import dayjs from 'dayjs';
import { WebClient } from '@slack/web-api';
import {
  Worker, Client, Work, Identity,
  getWorkerFromIdentity, getClientFromIdentity, getWorkFromIdentity,
} from '../../firestore';

function getChatMethods() {
  const token = ''; // TODO: 안전하게 보관하기

  const client = new WebClient(token);

  return client.chat;
}

export async function sendWorkerCreationMsg(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const channel = '';

  const { postMessage } = getChatMethods();

  await postMessage({
    channel,
    text: '새로운 기술자가 가입했습니다!',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: '새로운 기술자가 가입했습니다!',
        },
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: worker.name,
        },
      },
      {
        type: 'image',
        title: {
          type: 'plain_text',
          text: '건설업 기초안전보건교육 이수증',
        },
        image_url: worker.certificateImage,
        alt_text: '건설업 기초안전보건교육 이수증',
      },
    ],
    attachments: [
      {
        fallback: '프로필 정보',
        color: '#1E6AFF',
        fields: [
          {
            title: '전화번호',
            value: worker.phoneNumber,
            short: true,
          },
          {
            title: '전문분야',
            value: worker.specialties.reduce((specialtiesStr, specialty) => `${specialtiesStr}, ${specialty}`),
            short: true,
          },
          {
            title: '경력',
            value: `${worker.career}년`,
            short: true,
          },
          {
            title: '희망일당',
            value: `${Math.floor(worker.minWage / 10000)} ~ ${Math.floor(worker.maxWage / 10000)}만원`,
            short: true,
          },
          {
            title: '시공 가능 지역',
            value: Object.entries(worker.districts).reduce((districtsStr, [largeDistrict, smallDistricts]) => {
              const largeDistrictsStr = smallDistricts.reduce((result, smallDistrict) => {
                if (result === '') {
                  return `${largeDistrict} ${smallDistrict}`;
                }

                return `${result}, ${largeDistrict} ${smallDistrict}`;
              }, '');

              if (districtsStr === '') {
                return largeDistrictsStr;
              }

              return `${districtsStr}, ${largeDistrictsStr}`;
            }, ''),
          },
        ],
        thumb_url: worker.profileImage || undefined,
      },
    ],
  });
}

export async function sendClientCreationMsg(_client: Identity<Client>): Promise<void> {
  const client = await getClientFromIdentity(_client);

  const channel = '';

  const { postMessage } = getChatMethods();

  await postMessage({
    channel,
    text: '새로운 구인자가 가입했습니다!',
    attachments: [
      {
        fallback: '프로필 정보',
        color: '#1E6AFF',
        fields: [
          {
            title: '이름',
            value: client.name,
            short: true,
          },
          {
            title: '번호',
            value: client.phoneNumber,
            short: true,
          },
        ],
      },
    ],
  });
}

export async function sendWorkCreationMsg(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const channel = '';

  const { postMessage } = getChatMethods();

  await postMessage({
    channel,
    text: '새로운 일자리가 등록되었습니다!',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: '새로운 일자리가 등록되었습니다!',
        },
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: work.title,
        },
      },
    ],
    attachments: [
      {
        fallback: '일자리 정보',
        color: '#1E6AFF',
        fields: [
          {
            title: '분야',
            value: work.field,
            short: true,
          },
          {
            title: '일시',
            value: dayjs(work.startDate).isSame(work.endDate, 'date')
              ? dayjs(work.startDate).format('YYYY.MM.DD(dd)')
              : `${dayjs(work.startDate).format('YYYY.MM.DD(dd)')} ~ ${dayjs(work.endDate).format('YYYY.MM.DD(dd)')}`,
            short: true,
          },
          {
            title: '장소',
            value: `${work.address1} ${work.address2} ${work.addressDetail || ''}`,
            short: true,
          },
          {
            title: '총액',
            value: `${Math.floor(work.totalCost / 10000)}만원`,
            short: true,
          },
        ],
      },
    ],
  });
}
