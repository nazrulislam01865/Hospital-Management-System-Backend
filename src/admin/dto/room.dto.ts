import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  roomType: string;

  @IsInt({ message: 'Total beds must be an integer number' })
  @Min(1, { message: 'Total beds must be at least 1' })
  totalBeds: number;
}