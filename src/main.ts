import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './adapters/socker-io.adapters';
import { urlencoded, json } from 'body-parser';
import * as express from 'express';
import { resolve, join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(express.static(join(process.cwd(), '../client/dist/')));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  
  const options = new DocumentBuilder()
    .setTitle('ENFT API')
    .setDescription('ENFT api')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
