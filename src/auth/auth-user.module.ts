import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '../entity/auth-user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 36000,
        },
      }),
    }),
    TypeOrmModule.forFeature([AuthUser]),
  ],
  providers: [AuthUserService, JwtStrategy],
  controllers: [AuthUserController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
