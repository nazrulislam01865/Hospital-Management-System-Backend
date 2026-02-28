import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class AppointmentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {message: 'Patient name should not contain any numbers'})
  patientName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {message: 'Doctor name should not contain any numbers'})
  doctorName: string;

  @IsDateString({}, { message: 'Please provide a valid appointment date' })
  appointmentDate: string;
}