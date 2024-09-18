import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface SwaggerConfig {
  name: string;
  description: string;
  version: string;
  prefix: string;
}

export default async function setupSwagger(
  app: INestApplication,
): Promise<void> {
  const configService = app.get(ConfigService);
  const logger = new Logger('SwaggerSetup');
  const version = configService.get<string>('VERSION', '1');
  const prefix = configService.get<string>('API_GLOBAL_PREFIX', 'api');

  const swaggerConfig: SwaggerConfig = {
    name: 'Oganization Management System API Documentation',
    description: 'API Description',
    version,
    prefix: `${prefix}/v${version}/docs`,
  };

  const documentBuild = new DocumentBuilder()
    .setTitle(swaggerConfig.name)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'accessToken',
        description: 'Enter your access token',
        in: 'header',
      },
      'accessToken',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'refreshToken',
        description: 'Enter your refresh token',
        in: 'header',
      },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app as any, documentBuild, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(swaggerConfig.prefix, app as any, document, {
    explorer: true,
    customSiteTitle: swaggerConfig.name,
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
      withCredentials: true,
    },
  });

  logger.log(`Swagger documentation available at /${swaggerConfig.prefix}`);
}
