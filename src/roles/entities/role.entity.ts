import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id?: string; // [cite: 27, 30]

  @Column({ unique: true })
  role_name?: string; // [cite: 28, 31]

  @Column({ nullable: true })
  description?: string; // [cite: 32, 34]

  // Relación inversa: Un rol puede estar en muchos usuarios
  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
