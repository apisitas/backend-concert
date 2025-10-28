import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string; // required

  @IsInt()
  @Min(1)
  totalSeats: number;
}
