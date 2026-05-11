import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RoomAssignmentEntity } from './room-assignment.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  uniqueId: string;

  @Column({ length: 50 })
  roomType: string;

  @Column({ type: 'int' })
  totalBeds: number;

  @Column({ type: 'int' })
  availableBeds: number;

  @OneToMany(() => RoomAssignmentEntity, (assignment) => assignment.room)
  assignments: RoomAssignmentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}
