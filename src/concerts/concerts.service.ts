import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async createConcert(data: CreateConcertDto) {
    console.log('data-----------------',data);
    
    return this.prisma.concert.create({ data });
  }

  async getAllConcerts() {
    return this.prisma.concert.findMany();
  }

  async getConcert(id: string) {
    return this.prisma.concert.findUnique({ where: { id } });
  }

  async deleteConcert(id: string) {
    return this.prisma.concert.delete({ where: { id } });
  }

  async reserveSeat(concertId: string, userId: string) {
    return this.prisma.reservation.create({
      data: { concertId, userId },
    });
  }

  async cancelReservation(concertId: string, userId: string) {
    return this.prisma.reservation.deleteMany({
      where: { concertId, userId },
    });
  }
}
