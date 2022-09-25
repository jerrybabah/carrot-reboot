/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config();
const repl = require('repl');

console.log(`현재 작업 디렉토리: ${process.cwd()}`);

const replServer = repl.start('> ');

replServer.on('exit', () => {
  replServer.close();
  process.exit();
});

const admin = require('firebase-admin');

const serviceAccount = require('../../dev---carrot-reboot-firebase-adminsdk-qio69-42658eced3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const clientServices = require('./src/client.service');
const favoriteServices = require('./src/favorite.service');
const workServices = require('./src/work.service');
const workerServices = require('./src/worker.service');
const portfolioServices = require('./src/portfolio.service');
const reviewServices = require('./src/review.service');
const recruitServices = require('./src/recruit.service');

const preLoadedModules = {
  admin,
  firestore: admin.firestore(),
  ...clientServices,
  ...favoriteServices,
  ...workServices,
  ...workerServices,
  ...portfolioServices,
  ...reviewServices,
  ...recruitServices,
};

Object.entries(preLoadedModules).forEach(([key, value]) => {
  replServer.context[key] = value;
});
