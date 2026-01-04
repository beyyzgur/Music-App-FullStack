import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UserType } from '../users/user-type.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './roles.guard';
import { Artist } from 'src/artists/artist.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, UserType, Artist]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is missing');
        }
        const expiresIn = Number(config.get('JWT_EXPIRES_IN') ?? 3600);

        if (!Number.isFinite(expiresIn)) {
          throw new Error('JWT_EXPIRES_IN must be a number');
        }
        return {
          secret,
          signOptions: {
            expiresIn, // ✅ sadece number
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [JwtModule],
})
export class AuthModule {}
