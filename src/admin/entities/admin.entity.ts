import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,OneToMany,} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';
import { Appointment } from './appointment.entity';
import { BillEntity } from './bill.entity';

@Entity('admins')
export class AdminEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  uniqueId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true, nullable: true })
  uname: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  socialMediaLinks?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.admin)
  appointments: Appointment[];

  @OneToMany(() => BillEntity, (bill) => bill.admin)
  bills: BillEntity[];

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}