// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { AdminEntity } from './admin.entity';
// import { BillEntity } from './bill.entity';

// @Entity('appointments')
// export class Appointment {

//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 150, unique: true })
//   uniqueId: string;

//   @Column()
//   patientName: string;

//   @Column()
//   doctorName: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   appointmentDate: Date;

//   @Column({
//     length: 30,
//     default: 'Unpaid',
//   })
//   paymentStatus: string;

//     @ManyToOne(() => AdminEntity, (admin) => admin.appointments, {
//     onDelete: 'CASCADE',
//   })
//   admin: AdminEntity;

//   @OneToOne(() => BillEntity, (bill) => bill.appointment)
//   bill: BillEntity;

//   constructor() {
//     if (!this.uniqueId) {
//       this.uniqueId = uuidv4();
//     }
//   }
// }


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminEntity } from './admin.entity';
import { BillEntity } from './bill.entity';
import { PaitentEntity } from '../../patient/entities/patient.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  uniqueId: string;

  @ManyToOne(() => PaitentEntity, (patient) => patient.appointments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'patientId' })
  patient: PaitentEntity;

  @Column()
  doctorName: string;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ length: 30, default: 'Pending' })
  status: string;

  @Column({ length: 30, default: 'Unpaid' })
  paymentStatus: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => AdminEntity, (admin) => admin.appointments, {
    onDelete: 'CASCADE',
  })
  admin: AdminEntity;
  


  @OneToOne(() => BillEntity, (bill) => bill.appointment)
  bill: BillEntity;
  

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}