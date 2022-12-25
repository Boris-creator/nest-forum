import { Test, TestingModule } from '@nestjs/testing';
import { Notifications } from './notifications';

describe('Notifications', () => {
  let provider: Notifications;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Notifications],
    }).compile();

    provider = module.get<Notifications>(Notifications);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
