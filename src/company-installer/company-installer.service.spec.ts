import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInstallerService } from './company-installer.service';

describe('CompanyInstallerService', () => {
  let service: CompanyInstallerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyInstallerService],
    }).compile();

    service = module.get<CompanyInstallerService>(CompanyInstallerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
