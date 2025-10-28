import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly service: ConcertsService) { }

  @Post()
  async create(@Body() data: CreateConcertDto) {
    return this.service.createConcert(data);
  }

  @Get()
  async findAll() {
    return this.service.getAllConcerts();
  }

  @Get('stats')
  async getStats() {
    return this.service.getConcertStats();
  }

  @Get('reservations')
  async getAllReservations() {
    return this.service.getAllReservations();
  }
  @Get('reservations/:userId')
  async getAllReservationsByUser(@Param('userId') userId: string) {
    return this.service.getAllReservationsByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getConcert(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteConcert(id);
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

  @Post(':id/reservations/action')
  async handleReservationAction(
    @Param('id') concertId: string,
    @Body('email') email: string,
    @Body('action') action: 'RESERVE' | 'CANCEL',
  ) {
    if (!email) throw new BadRequestException('email is required');

    if (action === 'RESERVE') return this.service.reserveSeat(concertId, email);
    if (action === 'CANCEL') return this.service.cancelReservation(concertId, email);

    throw new BadRequestException('Invalid action');
  }

  @Get('reservations/email/:email')
  async getAllReservationsByEmail(@Param('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.service.getUserByEmail(email);
    if (!user) throw new NotFoundException(`User with email "${email}" not found`);

    return this.service.getAllReservationsByUser(user.id);
  }


}