import { isEmptyObject } from '../is-empty-object';

describe('IsEmptyObject Helper', () => {
  it('should return false when an empty object is received', () => {
    const result = isEmptyObject({});

    expect(result).toBeTruthy();
  });

  it('should return true when an object with at least one field is received', () => {
    const result = isEmptyObject({ key: 'value' });

    expect(result).toBeFalsy();
  });
});
