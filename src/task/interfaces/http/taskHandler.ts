import { AppContext } from '../../../core/app/context/appContext';
import { addTaskUseCaseFactory } from '../../usecase/addTaskUseCase';
import { Task } from '../../domain/task';
import httpResponse from '../../../core/interfaces/http/httpResponse';
import dateUtil from '../../../core/utils/dateUtil';

export type AddTaskRequestBody = Pick<Task, 'name' | 'description' | 'color'>;

export async function addTaskHandler(ctx: AppContext) {
  const requestBody: AddTaskRequestBody = ctx.request.body;
  const addTaskUseCase = addTaskUseCaseFactory(ctx);

  const result = await addTaskUseCase(requestBody);

  httpResponse(ctx).createSuccessResponse(201, parseResponseBody(result));
}

function parseResponseBody(task: Task) {
  return { ...task, create: dateUtil.toText(task.create), update: task.update && dateUtil.toText(task.update) };
}
