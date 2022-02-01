import { createErrorResult, createSuccessResult, Result } from '../../../src/core/utils/result';
import { ErrorHttpStatus, HttpResponseStatus, SuccessHttpStatus } from '../../../src/core/interfaces/http/httpResponse';
import { Response } from 'supertest';

export function expectResponse(res: Response): {
  toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => void;
  toMatchSuccess: (expStatus: SuccessHttpStatus, data?: any) => void;
  toBeError: (expStatus: ErrorHttpStatus, ...expErrors: { type: string; field?: string }[]) => void;
} {
  return {
    toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => {
      if (res.status != expStatus) {
        console.log(`Expected success status ${expStatus} but got ${res.status} with body: ${JSON.stringify(res.body)}`);
      }

      expect(res.status).toEqual(expStatus);
      if (data === undefined) {
        expect(res.body).toStrictEqual({ status: HttpResponseStatus.SUCCESS, messages: [] });
      } else {
        expect(res.body).toStrictEqual({ status: HttpResponseStatus.SUCCESS, messages: [], data });
      }
    },
    toMatchSuccess: (expStatus: SuccessHttpStatus, data: any) => {
      if (res.status != expStatus) {
        console.log(`Expected success status ${expStatus} but got ${res.status} with body: ${JSON.stringify(res.body)}`);
      }

      expect(res.status).toEqual(expStatus);
      expect(res.body.status).toEqual(HttpResponseStatus.SUCCESS);
      expect(res.body.data).toMatchObject(data);
    },
    toBeError: (expStatus: ErrorHttpStatus, ...expErrors: { type: string; field?: string }[]) => {
      if (res.status != expStatus) {
        console.log(`Expected error status ${expStatus} but got ${res.status} with body: ${JSON.stringify(res.body)}`);
      }

      const messages = res.body.messages?.map(({ type, field }: any) => {
        return field ? { type, field } : { type };
      });
      expect(res.status).toEqual(expStatus);
      expect(res.body.status).toEqual(HttpResponseStatus.FAIL);
      expect(messages).toStrictEqual(expErrors);
    }
  };
}

export function expectResult<T, R>(
  result: Result<T, R>
): {
  toBeSuccess: (value: T) => void;
  toMatchSuccess: (value: any) => void;
  toBeError: (error: R) => void;
} {
  return {
    toBeSuccess: (value) => {
      expect(result).toStrictEqual(createSuccessResult(value));
    },
    toMatchSuccess: (value) => {
      expect(result.isValid).toBeTruthy();
      if (result.isValid) {
        expect(result.value).toMatchObject(value);
      }
    },
    toBeError: (error) => {
      expect(result).toStrictEqual(createErrorResult(error));
    }
  };
}
