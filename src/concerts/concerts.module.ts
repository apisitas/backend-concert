import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ConcertsService],
  controllers: [ConcertsController],
})
export class ConcertsModule {}
