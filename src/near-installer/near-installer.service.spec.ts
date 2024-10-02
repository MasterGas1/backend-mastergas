import { Test, TestingModule } from '@nestjs/testing';
import { NearInstallerService } from './near-installer.service';

describe('NearInstallerService', () => {
  let service: NearInstallerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NearInstallerService],
    }).compile();

    service = module.get<NearInstallerService>(NearInstallerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
