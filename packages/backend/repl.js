/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config();
const repl = require('repl');

console.log(`현재 작업 디렉토리: ${process.cwd()}`);

const admin = require('firebase-admin');
const serviceAccount = require('../../dev---carrot-reboot-firebase-adminsdk-qio69-42658eced3.json');

if (process.env.FIRESTORE_EMULATOR_HOST && process.env.GCLOUD_PROJECT) {
  console.log('실행환경: emulator');
  admin.initializeApp();
} else {
  console.log('실행환경: development');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const replServer = repl.start('> ');

replServer.on('exit', () => {
  replServer.close();
  process.exit();
});

const typesaurus = require('typesaurus');
const clientRepositories = require('./src/firestore/repository/client.repository');
const favoriteRepositories = require('./src/firestore/repository/favorite.repository');
const portfolioRepositories = require('./src/firestore/repository/portfolio.repository');
const recruitRepositories = require('./src/firestore/repository/recruit.repository');
const reviewRepositories = require('./src/firestore/repository/review.repository');
const workRepositories = require('./src/firestore/repository/work.repository');
const workerRepositories = require('./src/firestore/repository/worker.repository');

const preLoadedModules = {
  ...typesaurus,
  ...clientRepositories,
  ...favoriteRepositories,
  ...portfolioRepositories,
  ...recruitRepositories,
  ...reviewRepositories,
  ...workRepositories,
  ...workerRepositories,
};

Object.entries(preLoadedModules).forEach(([key, value]) => {
  replServer.context[key] = value;
});
