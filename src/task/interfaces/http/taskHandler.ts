import { AppContext } from '../../../core/app/context/appContext';
import { addTaskUseCaseFactory } from '../../usecase/addTaskUseCase';
import { Task } from '../../domain/task';
import httpResponse from '../../../core/interfaces/http/httpResponse';
import dateUtil from '../../../core/utils/dateParser';
import { httpRequest } from '../../../core/interfaces/http/httpRequest';
import { getTaskUseCaseFactory } from '../../usecase/getTaskUseCase';
import { updateTaskUseCaseFactory } from '../../usecase/updateTaskUseCase';

export type AddTaskRequestBody = Pick<Task, 'name' | 'description' | 'color'>;
export type UpdateTaskRequestBody = Partial<Pick<Task, 'name' | 'color' | 'description'>>;

export async function addTaskHandler(ctx: AppContext) {
  const addTaskUseCase = addTaskUseCaseFactory(ctx);
  const requestBody: AddTaskRequestBody = ctx.request.body;

  const result = await addTaskUseCase(requestBody);

  httpResponse(ctx).createSuccessResponse(201, parseResponseBody(result));
}

export async function getTaskHandler(ctx: AppContext) {
  const getTaskUseCase = getTaskUseCaseFactory(ctx);
  const taskId = httpRequest(ctx).getPathParamAsNumber('taskId');

  const result = await getTaskUseCase(taskId);

  if (result.isValid) {
    httpResponse(ctx).createSuccessResponse(200, parseResponseBody(result.value));
  } else {
    httpResponse(ctx).createErrorResponse(404, { type: result.error, message: 'Task not found' });
  }
}

export async function updateTaskHandler(ctx: AppContext) {
  const updateTaskUseCase = updateTaskUseCaseFactory(ctx);
  const taskId = httpRequest(ctx).getPathParamAsNumber('taskId');
  const requestBody: UpdateTaskRequestBody = ctx.request.body;

  const result = await updateTaskUseCase(taskId, requestBody);

  if (result.isValid) {
    httpResponse(ctx).createSuccessResponse(200, parseResponseBody(result.value));
  } else {
    httpResponse(ctx).createErrorResponse(404, { type: result.error, message: 'Task not found' });
  }
}

function parseResponseBody(task: Task) {
  return { ...task, create: dateUtil.toText(task.create), update: task.update && dateUtil.toText(task.update) };
}
