import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Appointment,
  AppointmentStatus,
} from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';

type JwtUser = {
  sub: string;
  email: string;
  roles?: string[];
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private isAdmin(user: JwtUser) {
    return user.roles?.includes('admin');
  }

  private isDoctor(user: JwtUser) {
    return user.roles?.includes('doctor') || user.roles?.includes('medico');
  }

  private isPatient(user: JwtUser) {
    return user.roles?.includes('patient') || user.roles?.includes('paciente');
  }

  async create(dto: CreateAppointmentDto, user: JwtUser) {
    if (!this.isPatient(user) && !this.isAdmin(user)) {
      throw new ForbiddenException('Solo pacientes o admin pueden crear citas');
    }

    const doctor = await this.userRepo.findOne({
      where: { id: dto.doctor_id },
      relations: ['roles'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor no encontrado');
    }

    const appointment = this.appointmentRepo.create({
      patient_id: user.sub,
      doctor_id: dto.doctor_id,
      datetime: new Date(dto.datetime),
      reason: dto.reason,
      status: AppointmentStatus.PENDING,
    });

    const saved = await this.appointmentRepo.save(appointment);

    return {
      message: 'Cita creada con éxito',
      appointmentId: saved.id,
    };
  }

  async findAll(user: JwtUser) {
    if (this.isAdmin(user)) {
      return await this.appointmentRepo.find({
        relations: ['patient', 'doctor'],
      });
    }

    if (this.isDoctor(user)) {
      return await this.appointmentRepo.find({
        where: { doctor_id: user.sub },
        relations: ['patient', 'doctor'],
      });
    }

    return await this.appointmentRepo.find({
      where: { patient_id: user.sub },
      relations: ['patient', 'doctor'],
    });
  }

  async findOne(id: string, user: JwtUser) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (this.isAdmin(user)) {
      return appointment;
    }

    if (this.isDoctor(user) && appointment.doctor_id === user.sub) {
      return appointment;
    }

    if (this.isPatient(user) && appointment.patient_id === user.sub) {
      return appointment;
    }

    throw new ForbiddenException('No autorizado');
  }

  async update(id: string, dto: UpdateAppointmentDto, user: JwtUser) {
    const appointment = await this.findOne(id, user);

    if (dto.datetime) {
      appointment.datetime = new Date(dto.datetime);
    }

    if (dto.reason) {
      appointment.reason = dto.reason;
    }

    if (dto.status) {
      appointment.status = dto.status;
    }

    await this.appointmentRepo.save(appointment);

    return {
      message: 'Cita actualizada',
    };
  }

  async remove(id: string, user: JwtUser) {
    const appointment = await this.findOne(id, user);

    await this.appointmentRepo.remove(appointment);

    return {
      message: 'Cita eliminada',
    };
  }
}
