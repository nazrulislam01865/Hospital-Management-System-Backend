import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class BillDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Patient ID must be an integer' })
  @Min(1, { message: 'Patient ID must be a positive integer' })
  patientId?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {
    message: 'Patient name should not contain any numbers',
  })
  patientName: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Service charge must be a number' })
  @Min(0, { message: 'Service charge can not be negative' })
  serviceCharge: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Room charge must be a number' })
  @Min(0, { message: 'Room charge can not be negative' })
  roomCharge?: number;

  @IsDateString({}, { message: 'Please provide a valid billing date' })
  billingDate: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Appointment ID must be an integer' })
  @Min(1, { message: 'Appointment ID must be a positive integer' })
  appointmentId?: number;
}