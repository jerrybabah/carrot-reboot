import * as admin from 'firebase-admin';
import { Request, Response } from 'firebase-functions';
import { FakeOption } from './type';
import { calculateAggregations } from './calculateAggregations';
import { generateFakeClients } from './generateFakeClients';
import { generateFakeRecruits } from './generateFakeRecruits';
import { generateFakeWorkers, generateFakeSpecialtyWorkers } from './generateFakeWorkers';
import { generateFakeWorks } from './generateFakeWorks';

async function generateFake(req: Request, res: Response): Promise<void> {
  const fakeOption: FakeOption = {
    client: {
      count: 20,
      favoriteCount: {
        min: 0,
        max: 10,
      },
    },
    worker: {
      count: 100,
      payProbability: [true], // 100%
      specialtyCount: {
        min: 1,
        max: 3,
      },
      districtCount: {
        min: 5,
        max: 30,
      },
      portfolio: {
        count: {
          min: 5,
          max: 10,
        },
        imageCount: {
          min: 1,
          max: 10,
        },
        descriptionProbability: [true, false], // 50%
      },
      wage: {
        value: {
          min: 120000,
          max: 380000,
        },
        gapSamples: [0, 10000, 20000, 30000, 40000, 50000],
      },
    },
    work: {
      count: 300,
      requiredWorkerCount: {
        min: 1,
        max: 3,
      },
      imageCount: {
        min: 0,
        max: 10,
      },
      recruit: {
        count: {
          min: 8,
          max: 12,
        },
        contractProbability: [true, false, false, false, false, false, false, false, false, false], // 10%
        offeredProbability: [true, false], // 50%
        reviewProbability: [true, false], // 50%
      },
      workStatusSamples: ['completed', 'working', 'working', 'scheduled', 'scheduled', 'scheduled'],
    },
  };

  admin.firestore().settings({ ignoreUndefinedProperties: true });

  await generateFakeWorkers(fakeOption);
  await generateFakeClients(fakeOption);
  await generateFakeWorks(fakeOption);
  await generateFakeRecruits(fakeOption);
  await generateFakeSpecialtyWorkers();
  await calculateAggregations();

  res.end('완료');
}

export default generateFake;
