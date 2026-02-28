import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { AdminDTO } from "./admin.dto";
import { AdminService } from "./admin.service";
import { DoctorDto } from "src/doctor/doctor.dto";
import { PatientDto } from "src/patient/patient.dto";

@Controller("admin")
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

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



}