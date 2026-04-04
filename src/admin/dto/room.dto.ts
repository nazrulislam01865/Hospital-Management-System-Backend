import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  roomType: string;

  @Type(() => Number)
  @IsInt({ message: 'Total beds must be an integer number' })
  @Min(1, { message: 'Total beds must be at least 1' })
  totalBeds: number;
}