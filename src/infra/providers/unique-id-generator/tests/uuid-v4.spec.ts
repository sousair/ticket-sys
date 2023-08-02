import { UuidV4Generator } from '../uuid-v4';
import uuid from 'uuid';

jest.mock('uuid', () => ({
  v4(): string {
    return 'uuid';
  },
}));

describe('UuidV4Generator Provider', () => {
  let sut: UuidV4Generator;

  beforeEach(() => {
    sut = new UuidV4Generator();
  });

  it('should call uuid.v4', () => {
    const uuidSpy = jest.spyOn(uuid, 'v4');

    sut.generate();
    
    expect(uuidSpy).toHaveBeenCalledTimes(1);
  });

  it('should return generated id', () => {
    const result = sut.generate();

    expect(result).toStrictEqual('uuid');
  });
});
