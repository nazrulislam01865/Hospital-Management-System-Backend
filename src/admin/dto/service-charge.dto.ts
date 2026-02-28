import { IsNumber, Min } from 'class-validator';

export class ServiceChargeDto {
  @IsNumber({}, { message: 'Service charge must be a number' })
  @Min(0, { message: 'Service charge can not be negative' })
  serviceCharge: number;
}