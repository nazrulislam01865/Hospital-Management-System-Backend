import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AdminDTO } from "./admin.dto";
import { AdminService } from "./admin.service";
import { DoctorDto } from "../doctor/doctor.dto";
import { PatientDto } from "../patient/patient.dto";
import { ServiceChargeDto } from "./dto/service-charge.dto";
import { BillDto } from "./dto/bill.dto";
import { AppointmentDto } from "./dto/appointment.dto";
import { RoomDto } from "./dto/room.dto";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { BillingReportDto } from "./dto/billingReport.dto";
import { AuthService } from "../auth/auth.service";


@UseGuards(JwtAuthGuard)
@Controller("admin")
export class AdminController {

    constructor(private readonly adminService: AdminService,
        private readonly authService: AuthService
    ) { }

    // Admin Management

    @Get('admins')
    getAllAdmins(): object {
        return this.adminService.getAllAdmins();
    }

    @Get('admins/:id')
    getAdminById(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.getAdminById(id);
    }

    // Create new doctor, patient, and manager
    @Post('admins')
    createAdmin(@Body() data: AdminDTO): object {
        return this.authService.registerAdmin(data);
    }

    @Put('update-patient/:id')
    updatePatient(@Param('id') id: number, @Body() data: PatientDto): object {
        return this.adminService.updatePatients(id, data);
    }
    @Put('admins/:id')
    updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: AdminDTO,
    ): object {
        return this.adminService.updateAdmin(id, data);
    }


    @Delete('admins/:id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number): object {
        return this.adminService.deleteAdmin(id);
    }





    //Patient


    @Get('patients/:id')
    getPatientById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getPatientById(id);
    }
    @Get('patients')
    getAllPatients() {
        return this.adminService.getAllPatients();
    }
    @Post('patients')
    createPatient(@Body() data: PatientDto):object {
        return this.adminService.createPatient(data);
    }
    @Put('patients/:id')
    updatePatients(@Param('id',ParseIntPipe) id: number, @Body() data:PatientDto ) {
        return this.adminService.updatePatients(id, data);
    }
    @Delete('patients/:id')
    deletePatient(@Param('id',ParseIntPipe) id: number) {
        return this.adminService.deletePatient(id);
    }


    //Appointment management
    
    @Get('appointments')
    getAllAppointments(): object {
        return this.adminService.getAllAppointments();
    }
    @Get('appointments/:id')
    getAppointmentById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getAppointmentById(id);
    }

    @Post('/:adminId/appointment')
    createAppointment(@Param('adminId', ParseIntPipe) adminId: number,@Body() dto: AppointmentDto) {
        return this.adminService.createAppointment(adminId, dto);
    }
    @Put('appointments/:id')
    updateAppointment(@Param('id',ParseIntPipe) id: number, @Body() dto: AppointmentDto) {
        return this.adminService.updateAppointment(id, dto);
    }

    @Patch('appointments/:id/approve')
    approveAppointment(@Param('id', ParseIntPipe) id: number){
        return this.adminService.approveAppointment(id);
    }
    @Patch('appointments/:id/cancel')
    cancelAppointment(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.cancelAppointment(id);
    }

    @Delete('appointments/:id')
    deleteAppointment(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteAppointment(id);
    }

    @Get('appointments/unpaid')
    getUnpaidAppointments() {
        return this.adminService.getUnpaidAppointments();
    }

    @Get('appointment/date/:date')
    getAppointmentsByDate(@Param('date') date: string) {
        return this.adminService.getAppointmentsByDate(date);
    }







    // Billing Management
    @Get('bills')
    getAllBills(): object {
        return this.adminService.getAllBills();
    }
    @Get('bills/:id')
    getBillById(@Param('id', ParseIntPipe) id: number):object {
        return this.adminService.getBillById(id);
    }

    @Post('bills')
    createBill(@Req() req:any, @Body() data: BillDto): object {
        return this.adminService.createBill(req.user.sub,data);
    }

    @Patch('bills/:id')
    updateBill(@Param('id', ParseIntPipe) id: number,@Body() data: BillDto,
    ) {
        return this.adminService.updateBill(id, data);
    }

    @Delete('bills/:id')
    deleteBill(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteBill(id);
    }

    @Patch('bills/:id/service-charge')
    updateServiceCharge(@Param('id', ParseIntPipe) id: number,@Body() data: ServiceChargeDto,) {
        return this.adminService.updateServiceCharge(id, data);
    }

    @Patch('bills/:id/pay')
    payBill(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.payBill(id);
    }

    @Get('billing-report')
    getBillingReport(@Query() query: BillingReportDto) {
        return this.adminService.getBillingReport(query.startDate, query.endDate);
    }





    // Room & Bed Management
    @Get('rooms')
    getAllRooms() {
        return this.adminService.getAllRooms();
    }

    @Get('rooms/:id')
    getRoomById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getRoomById(id);
    }

    @Post('rooms')
    createRoom(@Body() data: RoomDto) {
        return this.adminService.createRoom(data);
    }

    @Put('rooms/:id')
    updateRoom(@Param('id', ParseIntPipe) id: number, @Body() data: RoomDto) {
        return this.adminService.updateRoom(id, data);
    }

    @Delete('rooms/:id')
    deleteRoom(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteRoom(id);
    }

    @Patch('rooms/:id/assign-bed')
    assignBed(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.assignBed(id);
    }

    @Patch('rooms/:id/release-bed')
    releaseBed(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.releaseBed(id);
    }

    @Get('profile')
    getProfile(@Req() req:any){
        return{
            message: "Admin profile retrieved successfully",
            data: req.user
        }
    }


}