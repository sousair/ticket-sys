import { join } from 'path';
import { DataSource } from 'typeorm';

export type TypeORMConnectionConfigs = {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export class TypeORMConnectionManager {
  static dataSource: DataSource;

  static async getDataSource(typeORMConnectionConfigs: TypeORMConnectionConfigs): Promise<DataSource> {
    if (this.dataSource) return this.dataSource;

    const { type, host, port, username, password, database } = typeORMConnectionConfigs;

    const dataSource = new DataSource({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: <any>type,
      host,
      port,
      username,
      password,
      database,
      logging: false,
      entities: [join(__dirname, '/entities/**/*{.ts,.js}')],
      migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
      migrationsRun: true,
    });

    await dataSource.initialize();

    this.dataSource = dataSource;
    return this.dataSource;
  }

  static getInstance(): DataSource {
    return this.dataSource;
  }
}
