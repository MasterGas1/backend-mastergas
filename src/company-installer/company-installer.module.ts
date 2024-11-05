import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { CompanyInstallerService } from './company-installer.service';
import { CompanyInstallerController } from './company-installer.controller';
import { CompanyInstaller, CompanyInstallerSchema } from './entities/company-installer.entity';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CompanyInstallerController],
  providers: [CompanyInstallerService],
  imports: [

    MongooseModule.forFeature([
      {
        name: CompanyInstaller.name,
        schema: CompanyInstallerSchema
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
  exports: [ CompanyInstallerService, MongooseModule]
})
export class CompanyInstallerModule {}
