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

export class TypeORMCreateConnection {
  constructor(private readonly typeORMConnectionConfigs: TypeORMConnectionConfigs) {}
  async createConnection(): Promise<void> {
    const { type, host, port, username, password, database } = this.typeORMConnectionConfigs;
    
    await new DataSource({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: <any>type,
      host,
      port,
      username,
      password,
      database,
      logging: false,
      entities: [join(__dirname, '/entities/**/*{.ts,.js}')],
      migrations: [join(__dirname, '/migration/**/*{.ts,.js}')],
      migrationsRun: true,
    }).initialize();
  }
}
