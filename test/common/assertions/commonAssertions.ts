import { createErrorResult, createSuccessResult, Result } from '../../../src/core/utils/result';
import { ErrorHttpStatus, HttpResponseStatus, SuccessHttpStatus } from '../../../src/core/interfaces/http/httpResponse';
import { Response } from 'supertest';
import { expect } from 'chai';

export function expectResponse(res: Response): {
  toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => void;
  toMatchSuccess: (expStatus: SuccessHttpStatus, data?: any) => void;
  toBeError: (expStatus: ErrorHttpStatus, ...expErrors: { type: string; field?: string }[]) => void;
} {
  return {
    toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => {
      const expectedBody = data ? { status: HttpResponseStatus.SUCCESS, messages: [], data } : { status: HttpResponseStatus.SUCCESS, messages: [] };

      expect({
        status: res.status,
        body: res.body
      }).to.deep.equal({
        status: expStatus,
        body: expectedBody
      });
    },
    toMatchSuccess: (expStatus: SuccessHttpStatus, data: any) => {
      expect(res.status).to.equal(expStatus);
      expect(res.body.status).to.equal(HttpResponseStatus.SUCCESS);
      expect(res.body.data).to.contain(data);
    },
    toBeError: (expStatus: ErrorHttpStatus, ...expErrors: { type: string; field?: string }[]) => {
      const messages = res.body.messages?.map(({ type, field }: any) => {
        return field ? { type, field } : { type };
      });

      expect({
        status: res.status,
        bodyStatus: res.body.status,
        messages: messages
      }).to.deep.equal({
        status: expStatus,
        bodyStatus: HttpResponseStatus.FAIL,
        messages: expErrors
      });
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
      expect(result).to.deep.equal(createSuccessResult(value));
    },
    toMatchSuccess: (value) => {
      expect(result.isValid).to.true;
      if (result.isValid) {
        expect(result.value).to.contain(value);
      }
    },
    toBeError: (error) => {
      expect(result).to.deep.equal(createErrorResult(error));
    }
  };
}
