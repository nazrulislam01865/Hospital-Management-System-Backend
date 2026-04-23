import {Column,CreateDateColumn,Entity,JoinColumn,ManyToOne,OneToOne,PrimaryGeneratedColumn,} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminEntity } from './admin.entity';
import { Appointment } from './appointment.entity';

@Entity('bills')
export class BillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  uniqueId: string;

  @Column({ type: 'varchar', length: 255 })
  patientName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceCharge: number;

  @Column({ type: 'date' })
  billingDate: string;

  @Column({ length: 255, default: 'Unpaid' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => AdminEntity, (admin) => admin.bills, { onDelete: 'CASCADE' })
  admin: AdminEntity;

  @OneToOne(() => Appointment, (appointment) => appointment.bill, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  appointment?: Appointment;

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}