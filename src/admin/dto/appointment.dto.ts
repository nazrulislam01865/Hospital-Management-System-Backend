import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class AppointmentDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  patientId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {message: 'Doctor name should not contain any numbers'})
  doctorName: string;

  @IsDateString({}, { message: 'Please provide a valid appointment date' })
  @IsOptional()
  appointmentDate?: string;
}