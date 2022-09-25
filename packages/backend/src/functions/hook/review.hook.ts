import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import {
  ReviewDocData,
  pushReviewCreationNotification, wrapReview,
} from '../util';

export async function onCreateReview(createdReviewDocSnap: QueryDocumentSnapshot): Promise<any> {
  const createdReviewDocData = createdReviewDocSnap.data() as ReviewDocData;
  const createdReview = wrapReview(createdReviewDocData);

  return pushReviewCreationNotification(createdReview.worker.id, createdReview);
}
