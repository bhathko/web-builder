import { Test, TestingModule } from '@nestjs/testing';
import { ComponentTreeController } from './component-tree.controller';

describe('ComponentTreeController', () => {
  let controller: ComponentTreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentTreeController],
    }).compile();

    controller = module.get<ComponentTreeController>(ComponentTreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
