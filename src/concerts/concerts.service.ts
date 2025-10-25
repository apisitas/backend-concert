import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ConcertsService {
    constructor(private readonly prisma: PrismaService) { }

    /** Create a new concert */
    async createConcert(data: CreateConcertDto) {
        try {
            return await this.prisma.concert.create({ data });
        } catch (error) {
            console.error(error);
            // Catch Prisma errors (e.g., unique constraint violations)
            throw new InternalServerErrorException('Failed to create concert');
        }
    }

    /** Get all concerts */
    async getAllConcerts() {
        return this.prisma.concert.findMany({
            orderBy: { createdAt: 'desc' }, // optional: newest first
        });
    }

    /** Get one concert by ID */
    async getConcert(id: string) {
        const concert = await this.prisma.concert.findUnique({
            where: { id },
            include: {
                reservations: true, // optional: include relations if useful
            },
        });

        if (!concert) {
            throw new NotFoundException(`Concert with ID "${id}" not found`);
        }
        return concert;
    }

    /** Delete a concert by ID */
    async deleteConcert(id: string) {
        const concert = await this.prisma.concert.findUnique({ where: { id } });
        if (!concert) {
            throw new NotFoundException(`Concert with ID "${id}" not found`);
        }

        try {
            return await this.prisma.concert.delete({ where: { id } });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to delete concert');
        }
    }

    async reserveSeat(concertId: string, userId: string) {
        const concert = await this.prisma.concert.findUnique({
            where: { id: concertId },
            include: { reservations: true },
        });
        if (!concert) throw new NotFoundException(`Concert with ID "${concertId}" not found`);

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException(`User with ID "${userId}" not found`);

        // Prevent double booking
        const existing = await this.prisma.reservation.findUnique({
            where: { userId_concertId: { userId, concertId } },
        });
        if (existing) throw new ConflictException(`User "${userId}" already reserved this concert`);

        // **Check if seats are available**
        if (concert.reservations.length >= concert.totalSeats) {
            throw new ConflictException('No seats available');
        }

        return await this.prisma.reservation.create({ data: { concertId, userId } });
    }


    async cancelReservation(concertId: string, userId: string) {
        const reservation = await this.prisma.reservation.findUnique({
            where: { userId_concertId: { userId, concertId } },
        });

        if (!reservation) {
            throw new NotFoundException(
                `Reservation not found for user "${userId}" on concert "${concertId}"`,
            );
        }

        try {
            return await this.prisma.reservation.delete({
                where: { id: reservation.id },
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to cancel reservation');
        }
    }

    async getAllReservations() {
        return this.prisma.reservation.findMany({
            include: {
                user: true,     // include user info
                concert: true,  // include concert info
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getConcertStats() {
        const totalSeats = await this.prisma.concert.aggregate({
            _sum: { totalSeats: true },
        });

        const totalReserve = await this.prisma.reservation.count({
            where: { action: 'RESERVE' },
        });

        const totalCancel = await this.prisma.reservation.count({
            where: { action: 'CANCEL' },
        });

        return {
            totalSeats: totalSeats._sum.totalSeats || 0,
            totalReserve,
            totalCancel,
        };
    }


}
