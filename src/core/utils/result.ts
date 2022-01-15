export type Success = 'OK';
export const Success = 'OK';

export type Result<Value = Success, Error = string> = { isValid: true; value: Value } | { isValid: false; error: Error };

export function createEmptySuccessResult<Error = string>(): Result<Success, Error> {
  return { isValid: true, value: 'OK' };
}

export function createSuccessResult<Value, Error = string>(value: Value): Result<Value, Error> {
  return { isValid: true, value };
}

export function createErrorResult<Value = void, Error = string>(error: Error): Result<Value, Error> {
  return { isValid: false, error };
}
