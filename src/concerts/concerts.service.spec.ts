import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertsService, PrismaService],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();
  });

  // Clean DB before each test to avoid unique constraint errors
  beforeEach(async () => {
    await prisma.reservation.deleteMany();
    await prisma.concert.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should prevent double reservation by same user', async () => {
    const user = await prisma.user.create({ data: { email: `a+${Date.now()}@example.com` } });
    const concert = await prisma.concert.create({ data: { name: `Concert-${Date.now()}`, description: 'Test concert description', totalSeats: 1 } });

    await service.reserveSeat(concert.id, user.id);

    await expect(service.reserveSeat(concert.id, user.id)).rejects.toThrow(ConflictException);
  });

  it('should not oversell seats under sequential reservations', async () => {
    const user1 = await prisma.user.create({ data: { email: `u1+${Date.now()}@example.com` } });
    const user2 = await prisma.user.create({ data: { email: `u2+${Date.now()}@example.com` } });
    const concert = await prisma.concert.create({
      data: {
        name: `SaleTest-${Date.now()}`,
        totalSeats: 1,
        description: 'Sequential reservation test',
      },
    });

    await service.reserveSeat(concert.id, user1.id);
    await expect(service.reserveSeat(concert.id, user2.id)).rejects.toThrow(ConflictException);
  });
});
