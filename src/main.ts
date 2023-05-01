import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adpters/redis.io.adpter'

async function bootstrap() {
  const port: number = 3000;
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(port, () => console.log(`\nServer on http://localhost:${port}/`));
}
bootstrap();
