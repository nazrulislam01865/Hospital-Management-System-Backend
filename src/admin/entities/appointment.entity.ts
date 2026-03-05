import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminEntity } from './admin.entity';

@Entity('appointments')
export class Appointment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  uniqueId: string;

  @Column()
  patientName: string;

  @Column()
  doctorName: string;

  @CreateDateColumn({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({
    length: 30,
    default: 'Unpaid',
  })
  paymentStatus: string;

    @ManyToOne(() => AdminEntity, (admin) => admin.appointments, {
    onDelete: 'CASCADE',
  })
  admin: AdminEntity;

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}