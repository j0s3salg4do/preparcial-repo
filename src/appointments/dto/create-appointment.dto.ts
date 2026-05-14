import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctor_id!: string;

  @IsDateString()
  datetime!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
