import { objectHasUndefinedField } from '../object-has-undefined-field';

describe('ObjectHasUndefinedField Helper', () => {
  it('should return true when an object with a undefined field is received', () => {
    const result = objectHasUndefinedField({ key: undefined });

    expect(result).toBeTruthy();
  });

  it('should return false when an object with filled field is received', () => {
    const result = objectHasUndefinedField({ key: 'value' });

    expect(result).toBeFalsy();
  });

  it('should return false when an object with a null field is received', () => {
    const result = objectHasUndefinedField({ key: null });

    expect(result).toBeFalsy();
  });
});
