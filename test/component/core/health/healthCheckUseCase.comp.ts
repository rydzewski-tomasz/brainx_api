import { initFullEnv } from '../../../common/setup/initEnv';
import request from '../../../common/utils/request';
import { expectResponse } from '../../../common/assertions/commonAssertions';

describe('HealthCheck component test', () => {
  initFullEnv();

  const url = '/health';

  it('GIVEN all valid connections WHEN healthCheck THEN return success', async () => {
    // GIVEN

    // WHEN
    const response = await request.get(url);

    // THEN
    expectResponse(response).toBeSuccess(200);
  });
});
