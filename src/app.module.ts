import { Module } from '@nestjs/common';
import { ConcertsModule } from './concerts/concerts.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConcertsModule],
  providers: [PrismaService],
})
export class AppModule {}
