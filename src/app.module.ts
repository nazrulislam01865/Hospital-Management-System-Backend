import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Appointment } from './admin/entities/appointment.entity';

@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'Shuvessa',
      database: 'hospital_management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
