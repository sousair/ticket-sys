import { join } from 'path';
import { DataSource } from 'typeorm';
import { TypeORMConnectionConfigs, TypeORMConnectionManager } from '../connection-manager';

jest.mock('typeorm', () => ({
  DataSource: jest
    .fn()
    .mockReturnValueOnce({
      initialize: jest.fn().mockResolvedValue({}),
    })
    .mockReturnValueOnce({
      initialize: jest.fn().mockRejectedValue(new Error()),
    })
    .mockReturnValueOnce({
      initialize: jest.fn().mockResolvedValue({}),
    })
    .mockReturnValueOnce({
      initialize: jest.fn().mockResolvedValue({}),
    }),
}));

describe('TypeORMConnectionManager', () => {
  const configs: TypeORMConnectionConfigs = {
    type: 'db-type',
    host: 'host',
    port: 1234,
    database: 'database_name',
    username: 'db_user',
    password: 'db_password',
  };

  beforeEach(() => {
    TypeORMConnectionManager.dataSource = undefined;
  });

  it('should call typeorm.DataSource with correct values', async () => {
    await TypeORMConnectionManager.getDataSource(configs);

    const dirname = __dirname.split('/tests')[0];

    expect(DataSource).toHaveBeenCalledTimes(1);
    expect(DataSource).toHaveBeenCalledWith({
      ...configs,
      logging: false,
      entities: [join(dirname, '/entities/**/*{.ts,.js}')],
      migrations: [join(dirname, '/migrations/**/*{.ts,.js}')],
      migrationsRun: true,
    });
  });

  describe('getDataSource', () => {
    it('should throws when initialize throws', async () => {
      await expect(TypeORMConnectionManager.getDataSource(configs)).rejects.toThrow();
    });

    it('should return a DataSource when success on first call and set ', async () => {
      const result = await TypeORMConnectionManager.getDataSource(configs);

      expect(result).toBeDefined();
      expect(TypeORMConnectionManager.dataSource).toBeDefined();
    });

    it('should return a DataSource when success on second call and not call typeorm.DataSource', async () => {
      // * Simulate first call
      TypeORMConnectionManager.dataSource = <DataSource>{};

      const result = await TypeORMConnectionManager.getDataSource(configs);

      expect(result).toBeDefined();
      expect(TypeORMConnectionManager.dataSource).toBeDefined();
      expect(DataSource).not.toHaveBeenCalled();
    });
  });

  describe('getInstance', () => {
    it('should return undefined when dataSource is not initialized yet', () => {
      const result = TypeORMConnectionManager.getInstance();

      expect(TypeORMConnectionManager.dataSource).toBeUndefined();
      expect(result).toBeUndefined();
    });

    it('should return a DataSource when dataSource is initialized', () => {
      TypeORMConnectionManager.dataSource = <DataSource>{};
      const result = TypeORMConnectionManager.getInstance();

      expect(TypeORMConnectionManager.dataSource).toBeDefined();
      expect(result).toBeDefined();
    });
  });
});
