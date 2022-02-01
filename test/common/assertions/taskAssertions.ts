import { Response } from 'supertest';
import { SuccessHttpStatus } from '../../../src/core/interfaces/http/httpResponse';
import { Task } from '../../../src/task/domain/task';
import dateUtil from '../../../src/core/utils/dateParser';
import { expectResponse } from './commonAssertions';

export function expectTaskResponse(response: Response) {
  return {
    toBeSuccess: (expStatus: SuccessHttpStatus, task: Task) => {
      const taskResponseBody = { ...task, create: dateUtil.toText(task.create), update: task.update && dateUtil.toText(task.update) };
      expectResponse(response).toBeSuccess(expStatus, taskResponseBody);
    }
  };
}
