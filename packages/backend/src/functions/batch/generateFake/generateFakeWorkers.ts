import { collection, all, set, id, value } from 'typesaurus';
import faker from 'faker';
import {
  range, random, sample,
  sampleSize, round,
} from 'lodash';
import { FakeOption } from './type';
import {
  WORKER_COLLECTION_ID, PORTFOLIO_COLLECTION_ID, SPECIALTY_COLLECTION_ID, SPECIALTY_WORKER_COLLECTION_ID,
  Districts, Worker, Portfolio, SpecialtyWorker,
  FIELDS, DISTRICTS,
  mapLargeToHuge,
} from '../../../firestore';

export async function generateFakeWorkers(option: FakeOption): Promise<void> {
  console.log('=================================');
  console.log('generating fake workers...');

  faker.locale = 'ko';

  const { worker: workerOption } = option;

  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  await Promise.all(range(0, workerOption.count).map(async () => {
    const workerId = await id();

    // 전문분야
    const specialtyCount = random(workerOption.specialtyCount.min, workerOption.specialtyCount.max);

    // 포트폴리오
    const portfolioCount = random(workerOption.portfolio.count.min, workerOption.portfolio.count.max);

    // 일당
    const minWage = round(random(workerOption.wage.value.min, workerOption.wage.value.max), -4);
    const wageGap = sample(workerOption.wage.gapSamples)!;
    const maxWage = minWage + wageGap;

    // 작업지역
    const districtCount = random(workerOption.districtCount.min, workerOption.districtCount.max);
    const districts: Districts = {};
    const hugeDistricts = new Set<string>();

    range(0, districtCount).forEach(() => {
      const largeDistrict = sample(Object.keys(DISTRICTS))!;
      const smallDistrict = sample(DISTRICTS[largeDistrict])!;

      hugeDistricts.add(mapLargeToHuge(largeDistrict));

      if (districts[largeDistrict]) {
        districts[largeDistrict].push(smallDistrict);
      } else {
        districts[largeDistrict] = [smallDistrict];
      }
    });

    Object.keys(districts).forEach((largeDistrict) => {
      districts[largeDistrict].sort();
    });

    // 만료시간
    const isPaid = sample(workerOption.payProbability)!;

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const expirationDate = isPaid ? oneMonthLater : null;

    // 기술자 생성
    await set(workersColl, workerId, {
      id: workerId,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      profileImage: null,
      certificateImage: 'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/certificateImages%2Fcertificate_image.jpeg?alt=media&token=af3f5a27-22db-4cef-82b6-a027c445a564',
      specialties: sampleSize(FIELDS, specialtyCount),
      name: `${faker.name.lastName()}${faker.name.firstName()}`,
      phoneNumber: faker.phone.phoneNumberFormat(2).replace(/-/g, ''),
      totalScore: 0,
      averageScore: 0,
      reviewCount: 0,
      contractCount: 0,
      portfolioCount,
      favoriterCount: 0,
      career: faker.datatype.number(30),
      minWage,
      maxWage,
      hugeDistricts: Array.from(hugeDistricts).sort(),
      districts,
      description: faker.lorem.text(),
      expirationDate,
      isActive: isPaid,
      haveUncheckedOffers: false,
      haveUncheckedContracts: false,
      registrationToken: null,
    });

    // 포트폴리오 생성
    const portfoliosColl = collection<Portfolio>(`${WORKER_COLLECTION_ID}/${workerId}/${PORTFOLIO_COLLECTION_ID}`);

    await Promise.all(range(0, portfolioCount).map(async () => {
      const portfolioId = await id();

      const hasDescription = sample(workerOption.portfolio.descriptionProbability)!;

      await set(portfoliosColl, portfolioId, {
        id: portfolioId,
        workerId,
        createdAt: value('serverDate'),
        updatedAt: value('serverDate'),
        images: [
          'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/portfolios%2Fiuv1.jpeg?alt=media&token=0e1a7fb4-c4c2-45a7-a136-d11e2298d699',
          'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/portfolios%2Fiuv2.jpeg?alt=media&token=12a0dca7-8e6c-400a-8e67-81b519f684e3',
          'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/portfolios%2Fiuv3.jpeg?alt=media&token=28ccecbd-2eb9-4b92-91cc-480b640dae66',
          'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/portfolios%2Fiu4.jpeg?alt=media&token=62d91144-b358-4d93-9d51-46f29426f983',
        ],
        description: hasDescription ? faker.lorem.text() : null,
      });
    }));
  }));

  console.log('end!\n');
}

export async function generateFakeSpecialtyWorkers(): Promise<void> {
  console.log('=================================');
  console.log('generating fake workers by specialty...');

  faker.locale = 'ko';

  const workerscoll = collection<Worker>(WORKER_COLLECTION_ID);

  const workerDocs = await all(workerscoll);

  await Promise.all(workerDocs.map(async (workerDoc) => {
    const worker = workerDoc.data;

    const { specialties } = worker;

    await Promise.all(specialties.map(async (specialty) => {
      const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${specialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

      const specialtyWorkerId = await id();

      await set(specialtyWorkersColl, specialtyWorkerId, {
        id: specialtyWorkerId,
        workerId: worker.id,
        profileImage: worker.profileImage,
        specialties: worker.specialties,
        name: worker.name,
        phoneNumber: worker.phoneNumber,
        averageScore: worker.averageScore,
        reviewCount: worker.reviewCount,
        contractCount: worker.contractCount,
        minWage: worker.minWage,
        maxWage: worker.maxWage,
        hugeDistricts: worker.hugeDistricts,
        districts: worker.districts,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
        expirationDate: worker.expirationDate,
        isActive: worker.isActive,
      });
    }));
  }));

  console.log('end!\n');
}
