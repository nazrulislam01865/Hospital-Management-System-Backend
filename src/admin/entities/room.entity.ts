import {Column,CreateDateColumn,Entity,PrimaryGeneratedColumn,} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}