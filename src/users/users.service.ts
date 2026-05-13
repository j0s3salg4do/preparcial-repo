import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

type CreateUserData = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        is_active: true,
        roles: {
          id: true,
          role_name: true,
          description: true,
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['roles'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
  async addRole(userId: string, role: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.roles ??= [];

    user.roles.push(role);

    return this.userRepo.save(user);
  }

  async assignRoles(
    userId: string,
    roleNames: string[],
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roles = await this.roleRepo.find({
      where: roleNames.map((roleName) => ({
        role_name: roleName,
      })),
    });

    if (roles.length !== roleNames.length) {
      throw new BadRequestException('roles inválidos');
    }

    user.roles = roles;

    await this.userRepo.save(user);

    return {
      message: 'Roles asignados',
    };
  }
}
