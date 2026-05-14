import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString() //Verifica que nuestras appointments tengan una fecha de creacion dada
  datetime?: string;

  @IsOptional()
  @IsString() //Comprobamos que la rason de la cita sea un string
  reason?: string;

  @IsOptional() //Comprobamos que el estado de la cita sea un enum valido dentro de Appointment status
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
