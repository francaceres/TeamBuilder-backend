import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import {
  AllExceptionsFilter,
  PrismaClientExceptionFilter,
} from './shared/filters';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
