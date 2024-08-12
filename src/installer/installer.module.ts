import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { InstallerService } from './installer.service';
import { InstallerController } from './installer.controller';
import { Installer, InstallerSchema } from './entities/installer.entity';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [InstallerController],
  providers: [InstallerService],
  imports: [

    MongooseModule.forFeature([
      {
        name: Installer.name,
        schema: InstallerSchema
      }
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY_CHANGE_PASSWORD') || 'S3CR3TK3Y$_P455W0RD',
        }
      }
    }),

    RoleModule,

    UserModule
  ],
  exports: [ InstallerService, MongooseModule]
})
export class InstallerModule {}
