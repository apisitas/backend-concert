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
            getConcertStats: jest.fn(),
            getAllReservations: jest.fn(),
            getAllReservationsByUser: jest.fn(),
            getConcert: jest.fn(),
            deleteConcert: jest.fn(),
            reserveSeat: jest.fn(),
            cancelReservation: jest.fn(),
            getUserByEmail: jest.fn(),
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

  describe('handleReservationAction', () => {
    const concertId = '123';
    const email = 'test@example.com';

    it('should call reserveSeat when action is RESERVE', async () => {
      const mockResult = { message: 'Seat reserved' };
      (service.reserveSeat as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.handleReservationAction(concertId, email, 'RESERVE');

      expect(service.reserveSeat).toHaveBeenCalledWith(concertId, email);
      expect(result).toEqual(mockResult);
    });

    it('should call cancelReservation when action is CANCEL', async () => {
      const mockResult = { message: 'Reservation cancelled' };
      (service.cancelReservation as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.handleReservationAction(concertId, email, 'CANCEL');

      expect(service.cancelReservation).toHaveBeenCalledWith(concertId, email);
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException for invalid action', async () => {
      await expect(
        controller.handleReservationAction(concertId, email, 'INVALID' as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when email is missing', async () => {
      await expect(
        controller.handleReservationAction(concertId, '' as any, 'RESERVE'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
