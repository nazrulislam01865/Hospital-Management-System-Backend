import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Appointment } from "./entities/appointment.entity";
import { AdminEntity } from "./entities/admin.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { BillEntity } from "./entities/bill.entity";
import { PaitentEntity } from "../patient/entities/patient.entity";
import { RoomEntity } from "./entities/room.entity";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        AdminEntity,Appointment,
        BillEntity,
        PaitentEntity,
        RoomEntity, 
    ]),
    AuthModule,MailModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
