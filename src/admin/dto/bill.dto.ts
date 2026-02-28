import { IsDateString, IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class BillDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {message: 'Patient name should not contain any numbers'})
  patientName: string;

  @IsNumber({}, { message: 'Service charge must be a number' })
  @Min(0, { message: 'Service charge can not be negative' })
  serviceCharge: number;

  @IsDateString({}, { message: 'Please provide a valid billing date' })
  billingDate: string;
}