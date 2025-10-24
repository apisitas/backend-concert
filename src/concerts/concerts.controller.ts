import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

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

  @Post(':id/reserve')
  async reserve(@Param('id') concertId: string, @Body() { userId }: { userId: string }) {
    return this.service.reserveSeat(concertId, userId);
  }

  @Delete(':id/cancel')
  async cancel(@Param('id') concertId: string, @Body() { userId }: { userId: string }) {
    return this.service.cancelReservation(concertId, userId);
  }
}
