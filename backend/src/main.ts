import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Vazios Urbanos')
    .setDescription('Documentação da API do projeto (Auth, Users, Voids, etc.)')
    .setVersion('1.0.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  logger.log(`🚀 Servidor iniciado em: ${baseUrl}`);
  logger.log(`📚 Swagger UI disponível em: ${baseUrl}/docs`);
  logger.log(`🏠 Página inicial (health/info): ${baseUrl}/`);
}

bootstrap();
