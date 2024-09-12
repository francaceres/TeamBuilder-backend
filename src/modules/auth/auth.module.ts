import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { VisibilityBasedGroupAccessGuard } from 'src/shared/guards';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    VisibilityBasedGroupAccessGuard,
  ],
  exports: [AuthService, JwtModule, VisibilityBasedGroupAccessGuard],
})
export class AuthModule {}
