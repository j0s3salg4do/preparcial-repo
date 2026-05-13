import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);

    return this.roleRepository.save(role);
  }
  async findOne(id: string) {
    return this.roleRepository.findOne({ where: { id } });
  }

  findAll() {
    return this.roleRepository.find();
  }
}
