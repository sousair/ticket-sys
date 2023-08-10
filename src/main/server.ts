import 'dotenv/config';
import { TypeORMConnectionManager } from '@infra/database/typeorm/connection-manager';
import { app } from './app';
import { EnvConfig } from './configs/env';
import { setupNodeJSEventHandlers } from './configs/setup-event-handlers';

TypeORMConnectionManager.getDataSource({
  type: 'mysql',
  database: EnvConfig.DATABASE_NAME,
  host: EnvConfig.DATABASE_HOST,
  port: EnvConfig.DATABASE_PORT,
  username: EnvConfig.DATABASE_USER,
  password: EnvConfig.DATABASE_USER_PASSWORD,
})
  .then(() => {
    setupNodeJSEventHandlers();
  })
  .then(() => {
    app.listen(EnvConfig.APP_PORT, () => {
      console.log(`Server running at port ${EnvConfig.APP_PORT}`);
    });
  });
