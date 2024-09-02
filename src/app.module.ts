import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import {
  AllExceptionsFilter,
  PrismaClientExceptionFilter,
} from './shared/filters';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
