import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    concert: { findUnique: jest.fn() },
    reservation: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should reserve a seat successfully', async () => {
    const userId = 'user1';
    const concertId = 'concert1';

    mockPrisma.user.findUnique.mockResolvedValue({ id: userId });
    mockPrisma.concert.findUnique.mockResolvedValue({
      id: concertId,
      totalSeats: 1,
      reservations: [], // must include reservations array
    });
    mockPrisma.reservation.findUnique.mockResolvedValue(null);
    mockPrisma.reservation.create.mockResolvedValue({ id: 'res1' });

    const result = await service.reserveSeat(concertId, userId);

    expect(result).toEqual({ id: 'res1' });
    expect(mockPrisma.reservation.create).toHaveBeenCalledWith(expect.objectContaining({
      data: { concertId, userId },
    }));
  });

  it('should throw ConflictException if seats are full', async () => {
    const userId = 'user2';
    const concertId = 'concert1';

    mockPrisma.concert.findUnique.mockResolvedValue({
      id: concertId,
      totalSeats: 1,
      reservations: [{ id: 'res1', userId: 'user1' }], // full
    });

    await expect(service.reserveSeat(concertId, userId))
      .rejects
      .toBeInstanceOf(ConflictException);
  });


  it('should throw ConflictException if user already reserved', async () => {
    const userId = 'user1';
    const concertId = 'concert1';

    mockPrisma.reservation.findUnique.mockResolvedValue({ id: 'res1' });

    await expect(service.reserveSeat(concertId, userId))
      .rejects
      .toBeInstanceOf(ConflictException);
  });

});
