import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { Appointment } from "./entities/appointment.entity";
import { AdminEntity } from "./entities/admin.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AdminEntity, Appointment]),],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
