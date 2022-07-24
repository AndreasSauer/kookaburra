import { Components } from '../../../server';
import { sanitizeErrorMessage } from '../../handler/util';

export default function (components: Components) {
  const { receiptRepository } = components;
  return {
    listReceipt: async function (data: any, callback: any) {
      try {
        callback({
          data: await receiptRepository.findAll(),
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    },
  };
}
