import { Test, TestingModule } from '@nestjs/testing';
import { ComponentTreeService } from './component-tree.service';

describe('ComponentTreeService', () => {
  let service: ComponentTreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentTreeService],
    }).compile();

    service = module.get<ComponentTreeService>(ComponentTreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
