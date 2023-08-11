import { failure, Failure, success, Success } from '@shared/either';

describe('Either', () => {
  type TestFailure = { failure: string };
  type TestSuccess = { success: string };

  it('failure function should return a failure instance', () => {
    const result = failure<TestFailure, TestSuccess>({ failure: '' });

    expect(result).toBeInstanceOf(Failure);
  });

  it('success function should return a success instance', () => {
    const result = success<TestFailure, TestSuccess>({ success: '' });

    expect(result).toBeInstanceOf(Success);
  });

  it('isFailure function should return true on a failure instance', () => {
    const failure = new Failure<TestFailure, TestSuccess>({ failure: '' });

    expect(failure.isFailure()).toBeTruthy();
  });

  it('isFailure function should return false on a success instance', () => {
    const success = new Success<TestFailure, TestSuccess>({ success: '' });

    expect(success.isFailure()).toBeFalsy();
  });

  it('isSuccess function should return false on a failure instance', () => {
    const failure = new Failure<TestFailure, TestSuccess>({ failure: '' });

    expect(failure.isSuccess()).toBeFalsy();
  });

  it('isSuccess function should return true on a success instance', () => {
    const success = new Success<TestFailure, TestSuccess>({ success: '' });

    expect(success.isSuccess()).toBeTruthy();
  });
});
