import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  const mockConcertsService = {
    createConcert: jest.fn(),
    getAllConcerts: jest.fn(),
    getConcert: jest.fn(),
    deleteConcert: jest.fn(),
    reserveSeat: jest.fn(),
    cancelReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
  });

  afterEach(() => {
    jest.resetAllMocks(); // reset mocks between tests
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if userId is missing when reserving', async () => {
    await expect(controller.reserve('concertId', undefined as any))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should throw BadRequestException if userId is missing when cancelling', async () => {
    await expect(controller.cancel('concertId', undefined as any))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should call service.reserveSeat when reserving with valid data', async () => {
    const userId = 'user1';
    const concertId = 'concert1';
    mockConcertsService.reserveSeat.mockResolvedValue('reserved');

    const result = await controller.reserve(concertId, userId);
    expect(service.reserveSeat).toHaveBeenCalledWith(concertId, userId);
    expect(result).toBe('reserved');
  });

  it('should call service.cancelReservation when cancelling with valid data', async () => {
    const userId = 'user1';
    const concertId = 'concert1';
    mockConcertsService.cancelReservation.mockResolvedValue('cancelled');

    const result = await controller.cancel(concertId, userId);
    expect(service.cancelReservation).toHaveBeenCalledWith(concertId, userId);
    expect(result).toBe('cancelled');
  });

  it('should handle ConflictException from reserveSeat', async () => {
    const userId = 'user1';
    const concertId = 'concert1';
    mockConcertsService.reserveSeat.mockRejectedValue(new ConflictException());

    await expect(controller.reserve(concertId, userId))
      .rejects
      .toBeInstanceOf(ConflictException);
  });
});
