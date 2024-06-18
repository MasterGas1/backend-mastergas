import { AppModule } from './app.module';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import *  as mongoose from 'mongoose';

async function bootstrap() {
  
  mongoose.plugin(schema => {
    schema.set('toJSON', {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret
      }
    })
  })
  
  const app = await NestFactory.create(AppModule);
    
  app.setGlobalPrefix("api/v1"); //TODO: set api/v1 in .env
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('MasterGas')
    .setDescription('The mastergas API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
      
  await app.listen(4000);
}
bootstrap();
