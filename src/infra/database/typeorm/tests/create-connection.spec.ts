import { DataSource } from 'typeorm';
import { TypeORMCreateConnection, TypeORMConnectionConfigs } from '../create-connection';
import { join } from 'path';

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => {
    return {
      initialize: jest.fn()
        .mockResolvedValueOnce({})
        // * need this to throw on second test case
        .mockRejectedValueOnce(new Error())
        // .mockResolvedValue({})
    };
  }),
}));

describe('TypeORMCreateConnection', () => {
  let sut: TypeORMCreateConnection;

  const configs: TypeORMConnectionConfigs = {
    type: 'db-type',
    host: 'host',
    port: 1234,
    database: 'database_name',
    username: 'db_user',
    password: 'db_password',
  };

  beforeEach(() => {
    sut = new TypeORMCreateConnection(configs);
  });

  it('should call typeorm.DataSource with correct values', async () => {
    await sut.createConnection();

    const dirname = __dirname.split('/tests')[0];

    expect(DataSource).toHaveBeenCalledTimes(1);
    expect(DataSource).toHaveBeenCalledWith({
      ...configs,
      logging: false,
      entities: [join(dirname, '/entities/**/*{.ts,.js}')],
      migrations: [join(dirname, '/migration/**/*{.ts,.js}')],
      migrationsRun: true,
    });
  });

  it('should call throws when initialize throws', async () => {
    await expect(sut.createConnection).rejects.toThrow();
  });
});
