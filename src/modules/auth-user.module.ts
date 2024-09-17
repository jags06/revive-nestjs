import { Module } from '@nestjs/common';
import { AuthUserController } from '../controllers/auth-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '../entity/auth-user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth-user/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUserService } from '../services/auth-user.service';

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
