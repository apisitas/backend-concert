import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly service: ConcertsService) {}

  @Post()
  async create(@Body() data: CreateConcertDto) {
    return this.service.createConcert(data);
  }

  @Get()
  async findAll() {
    return this.service.getAllConcerts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getConcert(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteConcert(id);
  }

  @Post(':id/reservations')
  async reserve(
    @Param('id') concertId: string,
    @Body('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.service.reserveSeat(concertId, userId);
  }

  @Delete(':id/reservations/:userId')
  async cancel(
    @Param('id') concertId: string,
    @Param('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.service.cancelReservation(concertId, userId);
  }
}
