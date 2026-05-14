import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string; // [cite: 19]

  @Column({ unique: true })
  email?: string; // [cite: 20]

  @Column({ select: false }) // Importante: No devolver password en respuestas
  password!: string; // [cite: 21]

  @Column()
  name?: string; // [cite: 22]

  @Column({ nullable: true})
  phone?: string;

  @Column({ default: true })
  is_active?: boolean; // [cite: 24]

  @CreateDateColumn()
  created_at?: Date; // [cite: 25]

  // Relación Many-to-Many
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles' })
  roles?: Role[];
}
