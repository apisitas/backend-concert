import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { BadRequestException } from '@nestjs/common';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: {
            createConcert: jest.fn(),
            getAllConcerts: jest.fn(),
            getConcert: jest.fn(),
            deleteConcert: jest.fn(),
            reserveSeat: jest.fn(),
            cancelReservation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if userId is missing when reserving', async () => {
    await expect(controller.reserve('concertId', undefined as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if userId is missing when cancelling', async () => {
    await expect(controller.cancel('concertId', undefined as any)).rejects.toThrow(BadRequestException);
  });
});
