import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RoomAssignDto {
  @IsNotEmpty({ message: 'Patient ID is required.' })
  @Type(() => Number)
  @IsInt({ message: 'Patient ID must be an integer.' })
  @Min(1, { message: 'Patient ID must be greater than 0.' })
  patientId: number;
}
