import { collection, all, set, id, value } from 'typesaurus';
import faker from 'faker';
import { range, sample, random, round } from 'lodash';
import { FakeOption } from './type';
import {
  WORK_COLLECTION_ID, CLIENT_COLLECTION_ID,
  Work, RequiredWorkerInfo, Client,
  FIELDS, DISTRICTS,
} from '../../../firestore';

export async function generateFakeWorks(option: FakeOption): Promise<void> {
  console.log('=================================');
  console.log('generating fake works...');

  faker.locale = 'ko';

  const { work: workOption } = option;

  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientDocs = await all(clientsColl);

  await Promise.all(range(0, workOption.count).map(async () => {
    const workId = await id();

    const workStatus = sample(workOption.workStatusSamples)!;

    let startDate: Date;
    let endDate: Date;

    switch (workStatus) {
      /**
       * 작업완료
       */
      case 'completed': {
        endDate = faker.date.recent(5);
        startDate = faker.date.recent(3, endDate);
        break;
      }
      /**
       * 작업중
       */
      case 'working': {
        startDate = faker.date.recent(1);
        endDate = faker.date.soon(2);
        break;
      }
      /**
       * 작업예정
       */
      default: {
        startDate = faker.date.soon(5);
        endDate = faker.date.soon(3, startDate);
      }
    }

    const address1 = sample(Object.keys(DISTRICTS))!;
    const address2 = sample(DISTRICTS[address1])!;

    const hasAddressDetail = sample([true, true, true, false]);

    const requiredWorkerCount = random(workOption.requiredWorkerCount.min, workOption.requiredWorkerCount.max);
    const requiredWorkers: RequiredWorkerInfo[] = [];
    let totalCost = 0;

    range(0, requiredWorkerCount).forEach(() => {
      const wage = round(random(120000, 380000), -4);

      requiredWorkers.push({
        type: sample(['기공', '조공'])!,
        wage,
      });

      totalCost += wage;
    });

    const client = sample(clientDocs)!.data;

    await set(worksColl, workId, {
      id: workId,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      client: {
        id: client.id,
        name: client.name,
        phoneNumber: client.phoneNumber,
      },
      field: sample(FIELDS)!,
      startDate,
      endDate,
      address1,
      address2,
      addressDetail: hasAddressDetail ? faker.lorem.words() : null,
      requiredWorkers,
      totalCost,
      title: faker.lorem.words(),
      description: faker.lorem.text(),
      images: [],
      isContracted: false,
      contractedAt: null,
      workStatus,
      contractCount: 0,
      haveUncheckedApplicants: false,
    });
  }));

  console.log('end!\n');
}
