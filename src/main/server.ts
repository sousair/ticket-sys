import { app } from './app';
import { EnvConfig } from './configs/env';

app.listen(EnvConfig.APP_PORT, () => {
  console.log(`Server running at port ${EnvConfig.APP_PORT}`);
});
