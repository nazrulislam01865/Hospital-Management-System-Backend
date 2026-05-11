import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ServiceChargeDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Service charge must be a number' })
  @Min(0, { message: 'Service charge can not be negative' })
  serviceCharge: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Room charge must be a number' })
  @Min(0, { message: 'Room charge can not be negative' })
  roomCharge?: number;
}