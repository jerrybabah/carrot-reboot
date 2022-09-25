import { EventContext } from 'firebase-functions';
import { changeWorksToWorkingStatus, changeWorksToCompletedStatus, expireWorkers } from '../../firestore';

export async function dailyJob(context: EventContext): Promise<any> {
  return Promise.all([
    changeWorksToWorkingStatus(),
    changeWorksToCompletedStatus(),
    expireWorkers(),
  ]);
}
