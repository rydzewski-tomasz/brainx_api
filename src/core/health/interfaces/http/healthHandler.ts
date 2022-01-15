import { HealthError, healthUseCaseFactory } from '../../usecase/healthUseCase';
import { AppContext } from '../../../app/context/appContext';
import httpResponse from '../../../interfaces/http/httpResponse';

export async function healthHandler(ctx: AppContext) {
  const healthUseCase = healthUseCaseFactory(ctx);

  const result = await healthUseCase();

  if (result.isValid) {
    httpResponse(ctx).createSuccessResponse(200);
  } else {
    httpResponse(ctx).createErrorResponse(503, {
      type: HealthError.DbConnection,
      message: 'Db connection problem!'
    });
  }
}
