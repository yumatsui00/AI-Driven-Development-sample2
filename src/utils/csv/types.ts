export type Result<T> = SuccessResult<T> | FailureResult;

export interface SuccessResult<T> {
  ok: true;
  data: T;
}

export interface FailureResult {
  ok: false;
  error: string;
}

/**
 * Builds a success Result wrapper.
 * @param data Value to wrap.
 * @returns Success result.
 */
export const ok = <T>(data: T): SuccessResult<T> => ({ ok: true, data });

/**
 * Builds a failure Result wrapper.
 * @param error Technical error message.
 * @returns Failure result.
 */
export const err = (error: string): FailureResult => ({ ok: false, error });
