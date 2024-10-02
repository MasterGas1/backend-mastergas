import { Test, TestingModule } from '@nestjs/testing';
import { NearInstallerController } from './near-installer.controller';
import { NearInstallerService } from './near-installer.service';

describe('NearInstallerController', () => {
  let controller: NearInstallerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NearInstallerController],
      providers: [NearInstallerService],
    }).compile();

    controller = module.get<NearInstallerController>(NearInstallerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
