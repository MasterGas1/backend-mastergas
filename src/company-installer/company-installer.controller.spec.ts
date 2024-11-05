import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInstallerController } from './company-installer.controller';
import { CompanyInstallerService } from './company-installer.service';

describe('CompanyInstallerController', () => {
  let controller: CompanyInstallerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyInstallerController],
      providers: [CompanyInstallerService],
    }).compile();

    controller = module.get<CompanyInstallerController>(CompanyInstallerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
