import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post() // Creacion de un appointment, un paciente puede crear una cita con un medico, una fecha una hora y un motivo
  create(@Body() dto: CreateAppointmentDto, @Req() req) {
    return this.appointmentsService.create(dto, req.user);
  }

  @Get() // Listado de citas "Pacientes ven solo sus citas, doctores ven solo las suyas, admin ve todas"
  findAll(@Req() req) {
    return this.appointmentsService.findAll(req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, // Actualizacion de datos de una cita "Solo la puede hacer el doctor"
    @Body() dto: UpdateAppointmentDto,
    @Req() req,
  ) {
    return this.appointmentsService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) { //Borrado de una cita "Solo el paciente o admin pueden eliminar una cita"
    return this.appointmentsService.remove(id, req.user);
  }
}
