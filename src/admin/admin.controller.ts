import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { AdminDTO } from "./admin.dto";
import { AdminService } from "./admin.service";
import { DoctorDto } from "src/doctor/doctor.dto";
import { PatientDto } from "src/patient/patient.dto";
import { ServiceChargeDto } from "./dto/service-charge.dto";
import { BillDto } from "./dto/bill.dto";
import { AppointmentDto } from "./dto/appointment.dto";
import { RoomDto } from "./dto/room.dto";

@Controller("admin")
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    // Admin Management

    // Create appointment
    @Post('/:adminId/appointment')
    createAppointment(@Param('adminId') adminId: number,@Body() dto: AppointmentDto) {
        return this.adminService.createAppointment(adminId, dto);
    }

    // Modify appointment
    @Patch('appointment/:id')
    updateAppointment(@Param('id') id: number,@Body() dto: Partial<AppointmentDto>) {
        return this.adminService.updateAppointment(id, dto);
    }

    // Retrieve appointment by date
    @Get('appointment/date/:date')
    getAppointmentsByDate(@Param('date') date: string) {
        return this.adminService.getAppointmentsByDate(date);
    }

    // Retrieve unpaid appointments
    @Get('appointment/unpaid')
    getUnpaidAppointments() {
        return this.adminService.getUnpaidAppointments();
    }














    // Get all users, doctors, patients, and managers
    @Get('get-all-users')
    getAllUsers(): object   {
        return this.adminService.getAllUsers();
    }
    @Get('admins')
    getAllAdmins(): object {
    return this.adminService.getAllAdmins();
  }
    @Get('doctors')
    getAllDoctors() {
        return this.adminService.getAllDoctors();
    }
    @Get('patients')
    getAllPatients() {
        return this.adminService.getAllPatients();
    }
    @Get('managers')
    getAllManagers() {
        return this.adminService.getAllManagers();
    }
    @Get('admins/:id')
    getAdminById(@Param('id', ParseIntPipe) id: number): object {
    return this.adminService.getAdminById(id);
  }

    // Create new doctor, patient, and manager
    @Post('doctors')
    createDoctor(@Body() data: DoctorDto): object {
        return this.adminService.createDoctor(data);
    }
    @Post('admins')
    createAdmin(@Body() data: AdminDTO): object {
        return this.adminService.createAdmin(data);
    }
    @Post('patients')
    createPatient(@Body() data: PatientDto): object {
        return this.adminService.createPatient(data);
    }
    @Post('managers')
    createManager(@Body() data: String): object {
        return this.adminService.createManager(data);
    }


    // Update doctor, patient, and manager by id
     @Put('update-doctor/:id')
    updateDoctor( @Param('id') id: number, @Body() data: DoctorDto): object {
        return this.adminService.updateDoctor(id, data);
    }
    @Put('update-manager/:id')
    updateManager(@Param('id') id: number, @Body() data: String): object {
        return this.adminService.updateManager(id, data);
    }
    @Put('update-patient/:id')
    updatePatient(@Param('id') id: number, @Body() data: PatientDto): object {
        return this.adminService.updatePatient(id, data);
    }
    @Put('admins/:id')
    updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: AdminDTO,
    ): object {
        return this.adminService.updateAdmin(id, data);
    }

    // Delete doctor, patient, and manager by id
    @Delete('patients/:id')
    deletePatient(@Param('id') id: number) {
        return this.adminService.deletePatient(id);
    }
    @Delete('doctors/:id')
    deleteDoctor(@Param('id') id: number) {
        return this.adminService.deleteDoctor(id);
    }
    @Delete('managers/:id')
    deleteManager(@Param('id') id: number) {
        return this.adminService.deleteManager(id);
    }
    @Delete('admins/:id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.deleteAdmin(id);
    }

    // Update doctor, patient, and manager by id
    @Patch('patients/:id')
    updatePatients(@Param('id') id: number, @Body() data: PatientDto):object {
        return this.adminService.updatePatients(id, data);
    }
    @Patch('doctors/:id')
    updateDoctors(@Param('id') id: number, @Body() data: DoctorDto):object {
        return this.adminService.updateDoctors(id, data);
    }
    @Patch('managers/:id')
    updateManagers(@Param('id') id: number, @Body() data: string):object {
        return this.adminService.updateManagers(id, data);
    }


    //Appointment, bill, room, and service charge management

    @Get('appointments')
    getAllAppointments(): object {
        return this.adminService.getAllAppointments();
    }

    // @Post('appointments')
    // createAppointment(@Body() data: AppointmentDto): object {
    //     return this.adminService.createAppointment(data);
    // }

    @Patch('appointments/:id/approve')
    approveAppointment(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.approveAppointment(id);
    }

    @Patch('appointments/:id/cancel')
    cancelAppointment(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.cancelAppointment(id);
    }

    // Billing Management
    @Get('bills')
    getAllBills(): object {
        return this.adminService.getAllBills();
    }

    @Post('bills')
    createBill(@Body() data: BillDto): object {
        return this.adminService.createBill(data);
    }

    @Patch('bills/:id/service-charge')
    updateServiceCharge(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ServiceChargeDto,
    ): object {
        return this.adminService.updateServiceCharge(id, data);
    }

    @Patch('bills/:id/pay')
    payBill(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.payBill(id);
    }

    // Room & Bed Management
    @Get('rooms')
    getAllRooms(): object {
        return this.adminService.getAllRooms();
    }

    @Post('rooms')
    createRoom(@Body() data: RoomDto): object {
        return this.adminService.createRoom(data);
    }

    @Patch('rooms/:id/assign-bed')
    assignBed(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.assignBed(id);
    }

    @Patch('rooms/:id/release-bed')
    releaseBed(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.releaseBed(id);
    }


}