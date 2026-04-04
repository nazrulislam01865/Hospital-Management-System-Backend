import { Appointment } from "../../admin/entities/appointment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('patient')
export class PaitentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150, unique: true })
    uniqueId: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'date', nullable: false })
    dateOfBirth?: string;

    @Column({ type: 'simple-array', nullable: true })
    socialMediaLinks?: string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Appointment[];

    constructor() {
        if (!this.uniqueId) {
        this.uniqueId = uuidv4();
        }
    }

}