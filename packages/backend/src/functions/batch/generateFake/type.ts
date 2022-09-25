export type FakeOption = {
  client: {
    count: number,
    favoriteCount: {
      min: number,
      max: number,
    },
  },
  worker: {
    count: number,
    payProbability: boolean[],
    specialtyCount: {
      min: number,
      max: number,
    },
    districtCount: {
      min: number,
      max: number,
    },
    portfolio: {
      count: {
        min: number,
        max: number,
      },
      imageCount: {
        min: number,
        max: number,
      },
      descriptionProbability: boolean[],
    },
    wage: {
      value: {
        min: number,
        max: number,
      },
      gapSamples: number[],
    },
  },
  work: {
    count: number,
    requiredWorkerCount: {
      min: number,
      max: number,
    },
    imageCount: {
      min: number,
      max: number,
    },
    recruit: {
      count: {
        min: number,
        max: number,
      }
      contractProbability: boolean[],
      offeredProbability: boolean[],
      reviewProbability: boolean[],
    },
    workStatusSamples: string[],
  },
};
