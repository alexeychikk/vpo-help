import { LoggerService } from '@vpo-help/server';
import { createApp } from './createApp';
import { EnvService } from './services';

async function bootstrap() {
  try {
    const env = new EnvService();

    env.ensureVariablesSet();

    const app = await createApp({ env });
    const logger = app.get(LoggerService);

    await app.listen(env.PORT, env.HOST);
    logger.log(`listening on http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    console.error(new Date().toISOString(), ' | ', error);
    process.exit(1);
  }
}

void bootstrap();
