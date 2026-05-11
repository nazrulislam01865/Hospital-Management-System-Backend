import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RoomEntity } from './room.entity';
import { PaitentEntity } from '../../patient/entities/patient.entity';
import { AdminEntity } from './admin.entity';

@Entity('room_assignments')
export class RoomAssignmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  uniqueId: string;

  @ManyToOne(() => RoomEntity, (room) => room.assignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room: RoomEntity;

  @ManyToOne(() => PaitentEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'patientId' })
  patient: PaitentEntity;

  @ManyToOne(() => AdminEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'assignedByAdminId' })
  assignedBy: AdminEntity;

  @Column({ length: 30, default: 'Assigned' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt?: Date;

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}
