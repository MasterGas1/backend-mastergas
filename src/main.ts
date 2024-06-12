import { AppModule } from './app.module';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

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
      
  await app.listen(4000);
}
bootstrap();
