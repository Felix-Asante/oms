import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import setupSwagger from './config/swagger';

async function bootstrap() {
  const logger = new Logger();
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    // app configs
    const version = configService.get<string>('VERSION');
    const port = configService.get<string>('PORT');
    const globalPrefix = configService.get<string>('API_GLOBAL_PREFIX');

    // global validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // transform payload from plain object to object typed according to DTO classes
      }),
    );

    // security
    app.use(helmet());
    app.enableCors({ methods: ['GET', 'PUT', 'POST', 'DELETE'] });

    // set up prefix and versioning
    app.setGlobalPrefix(globalPrefix);
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version || '1',
    });

    // swagger docs
    await setupSwagger(app);

    await app.listen(port);
    logger.log(`🚀🧨 Server is running on: ${await app.getUrl()} 🔥`);
  } catch (error) {
    logger.log(`Error starting server: ${error.message}`, error.stack);
    process.exit(1);
  }
}
bootstrap().catch((error) => {
  console.log('An unexpected error occured during bootstrap', error);
  process.exit(1);
});
